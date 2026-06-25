import type { ReactNode } from 'react';
import { StackQueueDiagram } from './StackQueueDiagram';
import { EventLoopDiagram } from './EventLoopDiagram';
import { HttpFlowDiagram } from './HttpFlowDiagram';
import { ReactLifecycleDiagram } from './ReactLifecycleDiagram';
import { CapTheoremDiagram } from './CapTheoremDiagram';
import { MonolithVsMicroservicesDiagram } from './MonolithVsMicroservicesDiagram';
import { BoxModelDiagram } from './BoxModelDiagram';
import { BinarySearchDiagram } from './BinarySearchDiagram';
import { JwtFlowDiagram } from './JwtFlowDiagram';
import { DockerImageContainerDiagram } from './DockerImageContainerDiagram';
import { BigODiagram } from './BigODiagram';

export const diagramRegistry: Record<string, ReactNode> = {
  'stack-queue': <StackQueueDiagram />,
  'event-loop': <EventLoopDiagram />,
  'http-flow': <HttpFlowDiagram />,
  'react-lifecycle': <ReactLifecycleDiagram />,
  'cap-theorem': <CapTheoremDiagram />,
  'monolith-vs-micro': <MonolithVsMicroservicesDiagram />,
  'box-model': <BoxModelDiagram />,
  'binary-search': <BinarySearchDiagram />,
  'jwt-flow': <JwtFlowDiagram />,
  'docker-image-container': <DockerImageContainerDiagram />,
  'big-o': <BigODiagram />,
};
