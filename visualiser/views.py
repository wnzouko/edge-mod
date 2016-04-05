from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render

from adapters.certuk_mod.builder.kill_chain_definition import KILL_CHAIN_PHASES
from adapters.certuk_mod.common.objectid import discover as objectid_discover
from adapters.certuk_mod.publisher.package_generator import PackageGenerator
from adapters.certuk_mod.publisher.publisher_edge_object import PublisherEdgeObject
from adapters.certuk_mod.validation.package.validator import PackageValidationInfo
from users.decorators import login_required_ajax


@login_required
def visualiser_discover(request):
    return objectid_discover(request, "visualiser_view", "visualiser_not_found")


@login_required
def visualiser_view(request, id_):
    request.breadcrumbs([("Visualiser", "")])
    return render(request, 'visualiser.html', {
        "id": id_,
        "kill_chain_phases": {item['phase_id']: item['name'] for item in KILL_CHAIN_PHASES}
    })


@login_required
def visualiser_not_found(request):
    return render(request, "visualiser_not_found.html", {})


@login_required_ajax
def visualiser_get(request, id_):
    def build_title(node):
        node_type = node.summary.get("type")
        try:
            title = {
                "ObservableComposition": node.obj.observable_composition.operator
            }.get(node_type, node.id_)
        except Exception as e:
            title = node.id_
        return title

    def depth_first_iterate(root_node):
        nodes = []
        links = []
        id_to_idx = {}
        stack = [(0, None, root_node)]
        while stack:
            depth, parent_idx, node = stack.pop()
            node_id = node.id_
            is_new_node = node_id not in id_to_idx
            if is_new_node:
                idx = len(nodes)
                id_to_idx[node_id] = idx
                title = node.summary.get("title", None)
                if title is None:
                    title = build_title(node)
                nodes.append(dict(id=node_id, type=node.ty, title=title, depth=depth))
            else:
                idx = id_to_idx[node_id]
            if parent_idx is not None:
                links.append({"source": parent_idx, "target": idx})
            if is_new_node:
                stack.extend((depth + 1, idx, edge.fetch()) for edge in node.edges)

        return dict(nodes=nodes, links=links)

    try:
        root_edge_object = PublisherEdgeObject.load(id_)
        graph = depth_first_iterate(root_edge_object)
        return JsonResponse(graph, status=200)
    except Exception as e:
        return JsonResponse(dict(e), status=500)


@login_required_ajax
def visualiser_item_get(request, id_):
    try:
        root_edge_object = PublisherEdgeObject.load(id_)
        package = PackageGenerator.build_package(root_edge_object)
        validation_info = PackageValidationInfo.validate(package)
        return JsonResponse({
            "root_id": id_,
            "package": package.to_dict(),
            "validation_info": validation_info.validation_dict
        }, status=200)
    except Exception as e:
        return JsonResponse(dict(e), status=500)