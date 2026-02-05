import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionTypes,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	INodeCredentialTestResult,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';

import {
	resolveTable,
	createItems,
	updateItems,
	getItems,
	deleteItems,
} from './GenericFunctions';
import { operationFields } from './OperationDescription';
import { getColumns, loadTables, searchTables } from './schemaCache';
import { executeQueryAsync } from './executeSQL/ExecuteQuery';

export class TransformSQLBuilder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Transform SQL Builder',
		name: 'transformsqlbuilder',
		icon: 'file:IbmDb2.svg',
		group: ['output'],
		version: 1,
		description: 'Ibm Db2 SQL Builder',
		subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
		defaults: {
			name: 'TransformSQLBuilder',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Slack',
						value: 'slack',
					},
					{
						name: 'Telegram',
						value: 'telegram',
					},
					{
						name: 'CSV file',
						value: 'csv',
					},
					{
						name: 'JSON file',
						value: 'json',
					},
					{
						name: 'Text file',
						value: 'text',
					},
				],
				default: 'slack',
			},
			
			...operationFields,
		],
	};


// ======================================================
	// EXECUTE
	// ======================================================
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		try {
			const resource = this.getNodeParameter('resource', 0) as string;
			if(resource == 'row'){
				const operation = this.getNodeParameter('operation', 0) as string;
				const tableRaw = this.getNodeParameter('tableId', 0);
				const table = resolveTable(tableRaw);						
				switch (operation) {
					case 'create':
						return [await createItems(this, credentials, table)];
					case 'update':
						return [await updateItems(this, credentials, table)];
					case 'delete':
						return [await deleteItems(this, credentials, table)];
					case 'get':
						return [await getItems(this, credentials, table)];
					default:
						(operation)
						throw new Error(`Unsupported operation: ${operation}`);
				}
			}
			else {				
				return [await executeQueryAsync(this, credentials)];				
			}
		} finally {
		}
	}
}
