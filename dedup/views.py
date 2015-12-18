from bson.json_util import dumps
from defusedxml import EntitiesForbidden
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from lxml.etree import XMLSyntaxError
from mongoengine import DoesNotExist

from adapters.certuk_mod.common.logger import log_error
from adapters.certuk_mod.dedup.DedupInboxProcessor import DedupInboxProcessor
from clippy.models import CLIPPY_TYPES
from edge.inbox import InboxError
from edge.tools import StopWatch
from users.decorators import JsonResponse
from users.models import Repository_User
from .duplicates_finder import find_duplicates


@login_required
def duplicates_finder(request):
    duplicates = {typ: find_duplicates(typ) for typ in CLIPPY_TYPES.iterkeys()}
    return render(request, "duplicates_finder.html", {
        'duplicates': dumps(duplicates)
    })


@csrf_exempt
def ajax_import(request, username):
    if not request.method == 'POST':
        return JsonResponse({}, status=405)
    if not request.META.get('Accept') == 'application/json':
        return JsonResponse({}, status=406)
    if not request.META.get('Content-Type') in {'application/xml', 'text/xml'}:
        return JsonResponse({}, status=415)

    try:
        request.user = Repository_User.objects.get(username=username)
    except DoesNotExist:
        return JsonResponse({}, status=403)

    elapsed = StopWatch()
    ip = None
    try:
        ip = DedupInboxProcessor(user=request.user, streams=[(request, None)])
        ip.run()
        return JsonResponse({
            'count': ip.saved_count,
            'duration': '%.2f' % elapsed.ms(),
            'message': ip.message,
            'state': 'success',
            'validation_result': ip.validation_result
        }, status=202)
    except (XMLSyntaxError, EntitiesForbidden, InboxError) as e:
        return JsonResponse({
            'duration': '%.2f' % elapsed.ms(),
            'message': e.message,
            'state': 'invalid',
            'validation_result': ip.validation_result if isinstance(ip, DedupInboxProcessor) else None
        }, status=400)
    except Exception as e:
        log_error(e, 'adapters/dedup/import', 'Import failed')
        return JsonResponse({
            'duration': '%.2f' % elapsed.ms(),
            'message': e.message,
            'state': 'error'
        }, status=500)
