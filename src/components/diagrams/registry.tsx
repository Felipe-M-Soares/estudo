import { lazy, Suspense, type ReactNode } from 'react';
import { GameLoader } from '../ui/GameLoader';

const StackQueueDiagram = lazy(() => import('./StackQueueDiagram').then((m) => ({ default: m.StackQueueDiagram })));
const EventLoopDiagram = lazy(() => import('./EventLoopDiagram').then((m) => ({ default: m.EventLoopDiagram })));
const HttpFlowDiagram = lazy(() => import('./HttpFlowDiagram').then((m) => ({ default: m.HttpFlowDiagram })));
const ReactLifecycleDiagram = lazy(() => import('./ReactLifecycleDiagram').then((m) => ({ default: m.ReactLifecycleDiagram })));
const CapTheoremDiagram = lazy(() => import('./CapTheoremDiagram').then((m) => ({ default: m.CapTheoremDiagram })));
const MonolithVsMicroservicesDiagram = lazy(() =>
  import('./MonolithVsMicroservicesDiagram').then((m) => ({ default: m.MonolithVsMicroservicesDiagram }))
);
const BoxModelDiagram = lazy(() => import('./BoxModelDiagram').then((m) => ({ default: m.BoxModelDiagram })));
const BinarySearchDiagram = lazy(() => import('./BinarySearchDiagram').then((m) => ({ default: m.BinarySearchDiagram })));
const JwtFlowDiagram = lazy(() => import('./JwtFlowDiagram').then((m) => ({ default: m.JwtFlowDiagram })));
const DockerImageContainerDiagram = lazy(() =>
  import('./DockerImageContainerDiagram').then((m) => ({ default: m.DockerImageContainerDiagram }))
);
const BigODiagram = lazy(() => import('./BigODiagram').then((m) => ({ default: m.BigODiagram })));
const RecursionStackDiagram = lazy(() => import('./RecursionStackDiagram').then((m) => ({ default: m.RecursionStackDiagram })));
const CssGridDiagram = lazy(() => import('./CssGridDiagram').then((m) => ({ default: m.CssGridDiagram })));
const ClosureDiagram = lazy(() => import('./ClosureDiagram').then((m) => ({ default: m.ClosureDiagram })));
const SqlJoinDiagram = lazy(() => import('./SqlJoinDiagram').then((m) => ({ default: m.SqlJoinDiagram })));
const MiddlewarePipelineDiagram = lazy(() =>
  import('./MiddlewarePipelineDiagram').then((m) => ({ default: m.MiddlewarePipelineDiagram }))
);
const ComponentTreeDiagram = lazy(() => import('./ComponentTreeDiagram').then((m) => ({ default: m.ComponentTreeDiagram })));
const JavaStreamDiagram = lazy(() => import('./JavaStreamDiagram').then((m) => ({ default: m.JavaStreamDiagram })));
const MultiStageBuildDiagram = lazy(() => import('./MultiStageBuildDiagram').then((m) => ({ default: m.MultiStageBuildDiagram })));
const RenderingStrategyDiagram = lazy(() =>
  import('./RenderingStrategyDiagram').then((m) => ({ default: m.RenderingStrategyDiagram }))
);
const GraphqlVsRestDiagram = lazy(() => import('./GraphqlVsRestDiagram').then((m) => ({ default: m.GraphqlVsRestDiagram })));
const LoadBalancerDiagram = lazy(() => import('./LoadBalancerDiagram').then((m) => ({ default: m.LoadBalancerDiagram })));
const SagaPatternDiagram = lazy(() => import('./SagaPatternDiagram').then((m) => ({ default: m.SagaPatternDiagram })));
const K8sPodsDiagram = lazy(() => import('./K8sPodsDiagram').then((m) => ({ default: m.K8sPodsDiagram })));
const CicdPipelineDiagram = lazy(() => import('./CicdPipelineDiagram').then((m) => ({ default: m.CicdPipelineDiagram })));
const ShardingDiagram = lazy(() => import('./ShardingDiagram').then((m) => ({ default: m.ShardingDiagram })));
const AsyncCommunicationDiagram = lazy(() =>
  import('./AsyncCommunicationDiagram').then((m) => ({ default: m.AsyncCommunicationDiagram }))
);
const LayeredArchitectureDiagram = lazy(() =>
  import('./LayeredArchitectureDiagram').then((m) => ({ default: m.LayeredArchitectureDiagram }))
);
const AsyncMessageQualityDiagram = lazy(() =>
  import('./AsyncMessageQualityDiagram').then((m) => ({ default: m.AsyncMessageQualityDiagram }))
);
const ValidationDiagram = lazy(() => import('./ValidationDiagram').then((m) => ({ default: m.ValidationDiagram })));
const SolidPrinciplesDiagram = lazy(() => import('./SolidPrinciplesDiagram').then((m) => ({ default: m.SolidPrinciplesDiagram })));
const ImageOptimizationDiagram = lazy(() =>
  import('./ImageOptimizationDiagram').then((m) => ({ default: m.ImageOptimizationDiagram }))
);
const WebSocketVsPollingDiagram = lazy(() =>
  import('./WebSocketVsPollingDiagram').then((m) => ({ default: m.WebSocketVsPollingDiagram }))
);
const IamPermissionsDiagram = lazy(() => import('./IamPermissionsDiagram').then((m) => ({ default: m.IamPermissionsDiagram })));
const ProbesDiagram = lazy(() => import('./ProbesDiagram').then((m) => ({ default: m.ProbesDiagram })));
const TracingDiagram = lazy(() => import('./TracingDiagram').then((m) => ({ default: m.TracingDiagram })));
const AdrStructureDiagram = lazy(() => import('./AdrStructureDiagram').then((m) => ({ default: m.AdrStructureDiagram })));

function withLoader(node: ReactNode): ReactNode {
  return <Suspense fallback={<GameLoader />}>{node}</Suspense>;
}

// Cada entrada é uma FUNÇÃO que renderiza o diagrama, não uma instância já criada —
// isso garante que o código de um diagrama só é baixado quando ele é efetivamente exibido.
export const diagramRegistry: Record<string, () => ReactNode> = {
  'stack-queue': () => withLoader(<StackQueueDiagram />),
  'event-loop': () => withLoader(<EventLoopDiagram />),
  'http-flow': () => withLoader(<HttpFlowDiagram />),
  'react-lifecycle': () => withLoader(<ReactLifecycleDiagram />),
  'cap-theorem': () => withLoader(<CapTheoremDiagram />),
  'monolith-vs-micro': () => withLoader(<MonolithVsMicroservicesDiagram />),
  'box-model': () => withLoader(<BoxModelDiagram />),
  'binary-search': () => withLoader(<BinarySearchDiagram />),
  'jwt-flow': () => withLoader(<JwtFlowDiagram />),
  'docker-image-container': () => withLoader(<DockerImageContainerDiagram />),
  'big-o': () => withLoader(<BigODiagram />),
  'recursion-stack': () => withLoader(<RecursionStackDiagram />),
  'css-grid': () => withLoader(<CssGridDiagram />),
  closure: () => withLoader(<ClosureDiagram />),
  'sql-join': () => withLoader(<SqlJoinDiagram />),
  'middleware-pipeline-diagram': () => withLoader(<MiddlewarePipelineDiagram />),
  'component-tree': () => withLoader(<ComponentTreeDiagram />),
  'java-stream': () => withLoader(<JavaStreamDiagram />),
  'multi-stage-build': () => withLoader(<MultiStageBuildDiagram />),
  'rendering-strategy': () => withLoader(<RenderingStrategyDiagram />),
  'graphql-vs-rest': () => withLoader(<GraphqlVsRestDiagram />),
  'load-balancer': () => withLoader(<LoadBalancerDiagram />),
  'saga-pattern': () => withLoader(<SagaPatternDiagram />),
  'k8s-pods': () => withLoader(<K8sPodsDiagram />),
  'cicd-pipeline-diagram': () => withLoader(<CicdPipelineDiagram />),
  sharding: () => withLoader(<ShardingDiagram />),
  'async-communication': () => withLoader(<AsyncCommunicationDiagram />),
  'layered-architecture': () => withLoader(<LayeredArchitectureDiagram />),
  'async-message-quality': () => withLoader(<AsyncMessageQualityDiagram />),
  validation: () => withLoader(<ValidationDiagram />),
  'solid-principles': () => withLoader(<SolidPrinciplesDiagram />),
  'image-optimization': () => withLoader(<ImageOptimizationDiagram />),
  'websocket-vs-polling': () => withLoader(<WebSocketVsPollingDiagram />),
  'iam-permissions': () => withLoader(<IamPermissionsDiagram />),
  probes: () => withLoader(<ProbesDiagram />),
  tracing: () => withLoader(<TracingDiagram />),
  'adr-structure': () => withLoader(<AdrStructureDiagram />),
};
