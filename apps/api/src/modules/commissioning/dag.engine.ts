export interface DAGNode {
  id: string;
  title: string;
  status: string;
  dependsOn: string[];
  estimatedDurationHours?: number;
}

export class DAGEngine {
  /**
   * Kahn's Algorithm / DFS for cycle detection.
   * Returns true if cycle exists, false if valid DAG.
   */
  static hasCycle(nodes: DAGNode[]): boolean {
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach((n) => {
      adj.set(n.id, []);
      inDegree.set(n.id, 0);
    });

    for (const node of nodes) {
      for (const dep of node.dependsOn) {
        if (adj.has(dep)) {
          adj.get(dep)!.push(node.id);
          inDegree.set(node.id, (inDegree.get(node.id) || 0) + 1);
        }
      }
    }

    const queue: string[] = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });

    let visitedCount = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      visitedCount++;

      for (const v of adj.get(u) || []) {
        inDegree.set(v, inDegree.get(v)! - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }

    return visitedCount !== nodes.length;
  }

  /**
   * Computes topological sorting of steps.
   */
  static topologicalSort(nodes: DAGNode[]): string[] {
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach((n) => {
      adj.set(n.id, []);
      inDegree.set(n.id, 0);
    });

    for (const node of nodes) {
      for (const dep of node.dependsOn) {
        if (adj.has(dep)) {
          adj.get(dep)!.push(node.id);
          inDegree.set(node.id, (inDegree.get(node.id) || 0) + 1);
        }
      }
    }

    const queue: string[] = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });

    const result: string[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      result.push(u);

      for (const v of adj.get(u) || []) {
        inDegree.set(v, inDegree.get(v)! - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }

    if (result.length !== nodes.length) {
      throw new Error("Cycle detected in commissioning DAG; cannot produce topological ordering.");
    }

    return result;
  }

  /**
   * Computes the Critical Path (longest path) of steps in terms of hours or step count.
   */
  static computeCriticalPath(nodes: DAGNode[]): { criticalPath: string[]; totalDuration: number } {
    const order = this.topologicalSort(nodes);
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();

    order.forEach((id) => {
      const duration = nodeMap.get(id)?.estimatedDurationHours || 1;
      dist.set(id, duration);
      prev.set(id, null);
    });

    for (const u of order) {
      const uDist = dist.get(u)!;
      // find children that depend on u
      for (const node of nodes) {
        if (node.dependsOn.includes(u)) {
          const v = node.id;
          const vWeight = node.estimatedDurationHours || 1;
          if (uDist + vWeight > (dist.get(v) || 0)) {
            dist.set(v, uDist + vWeight);
            prev.set(v, u);
          }
        }
      }
    }

    // Find end node with maximum distance
    let maxDist = 0;
    let endNode: string | null = null;
    dist.forEach((d, id) => {
      if (d > maxDist) {
        maxDist = d;
        endNode = id;
      }
    });

    const path: string[] = [];
    let curr = endNode;
    while (curr) {
      path.unshift(curr);
      curr = prev.get(curr) || null;
    }

    return {
      criticalPath: path,
      totalDuration: maxDist,
    };
  }

  /**
   * Evaluates if a given step can be unlocked/started: all predecessor dependencies must be COMPLETED.
   */
  static canStartStep(stepId: string, nodes: DAGNode[]): { canStart: boolean; uncompletedDependencies: string[] } {
    const target = nodes.find((n) => n.id === stepId);
    if (!target) return { canStart: false, uncompletedDependencies: ["Step not found"] };

    const uncompleted: string[] = [];
    for (const depId of target.dependsOn) {
      const depNode = nodes.find((n) => n.id === depId);
      if (!depNode || depNode.status !== "COMPLETED") {
        uncompleted.push(depNode ? depNode.title : depId);
      }
    }

    return {
      canStart: uncompleted.length === 0,
      uncompletedDependencies: uncompleted,
    };
  }
}
