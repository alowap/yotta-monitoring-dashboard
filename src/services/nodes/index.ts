import http from "../api";
import type { APIResponse, APIResponseStatus } from '@/services/types.ts'

async function getNodes() {
  return await http.get<APIResponse<Node[]>>('/api/nodes', {
    withCredentials: true,
  })
}

async function addNode(node: Node) {
  return await http.post<APIResponseStatus>('/api/nodes', node, {
    withCredentials: true,
  })
}

// TODO: Replace this mock with something working
async function updateNode(node: Node) {
  return await http.post<APIResponseStatus>('/api/nodes', node, {
    withCredentials: true,
  }) 
}

async function deleteNode(nname: string) {
  return await http.delete<APIResponseStatus>(`/api/nodes/${nname}`, {
    withCredentials: true,
  })
}

export default {
    getNodes,
    addNode,
    updateNode,
    deleteNode
};
