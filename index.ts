import { INodeType } from 'n8n-workflow';
import { TransformSQLBuilder } from './nodes/TransformSQLBuilder.node';
export const nodeTypes: INodeType[] = [  
	new TransformSQLBuilder(),
];
