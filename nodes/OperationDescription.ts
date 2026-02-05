import type { INodeProperties } from 'n8n-workflow';

export const operationFields: INodeProperties[] = [
	{
	displayName: 'Select',
	name: 'select',
	type: 'fixedCollection',
	typeOptions: { multipleValues: true },
	default: {},
	displayOptions: {
		show: {
			resource: ['slack','telegram','csv','json','text'],
		},
	},
	options: [
		{
			name: 'fields',
			displayName: 'Field',
			values: [
				{
					displayName: 'Column',
					name: 'columnSelect',
					type: 'collection',
					default: {},
					displayOptions: {
						show: { mode: ['column'] },
					},
					options: [
						{
							displayName: 'From',
							name: 'fromValue',
							type: 'options',							
							default: '',
						},
						{
							displayName: 'To',
							name: 'ToValue',
							type: 'string',
							default: '',
						},
					],
				},			
			],
		},
	],
	},
	{
		displayName: 'Data to Send',
		name: 'dataToSend',
		type: 'options',
		options: [		
			{
				name: 'Define Below for Each Column',
				value: 'defineBelow',
				description: 'Set the value for each destination column',
			},
		],
		displayOptions: {
			show: {
				operation: ['create', 'update'],
			},
		},
		default: 'defineBelow',
		description: 'Whether to insert the input data this node receives in the new row',
	},
	{
	displayName: 'Columns to Set',
	name: 'columnUI',
	placeholder: 'Add Row',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	displayOptions: {
		show: {
			operation: ['create', 'update','get'],
		},
	},
	default: {},
	options: [
		{
			name: 'items',
			displayName: 'Row',
			values: [
				{
					displayName: 'Columns',
					name: 'columns',
					type: 'fixedCollection',
					typeOptions: {
						multipleValues: true,
						multipleValueButtonText: 'Add Field',
					},
					default: {},
					options: [
						{
							name: 'fields',
							displayName: 'Field',
							values: [
								{
									displayName: 'Mode',
									name: 'mode',
									type: 'options',
									options: [
										{ name: 'Column', value: 'column' },
										{ name: 'Custom SQL Field', value: 'expression' },
									],
									default: 'column',
								},
								/* COLUMN MODE */
								{
									displayName: 'Column name of table',
									name: 'columnId',
									type: 'options',
									description: 'Choose DB column',
									typeOptions: {
										loadOptionsMethod: 'getColumns',
										loadOptionsDependsOn: ['tableId.value'],
									},
									default: '',
									displayOptions: { show: { mode: ['column'] } },
								},
								/* VALUE */
								{
									displayName: 'Type value',
									name: 'columnValue',
									type: 'string',
									default: '',
									typeOptions: {
										sqlDialect: 'StandardSQL',
										editor: 'sqlEditor',
										rows: 1,
									},
									placeholder: `Example: CAST('123' AS INT), CURRENT_TIMESTAMP, UPPER(...)`,
									displayOptions: { show: { mode: ['column'] } },
								},
								/* CUSTOM EXPRESSION */
								{
									displayName: 'SQL expression',
									name: 'sqlExpression',
									type: 'string',
									typeOptions: {
										sqlDialect: 'StandardSQL',
										editor: 'sqlEditor',
										rows: 2,
									},
									default: '',
									placeholder: `Column name of table`,
									displayOptions: { show: { mode: ['expression'] } },
								},
							],
						},
					],
				},				
			],
		},
	],
	},	
	/* ================= CONDITIONS ================= */
	{
	displayName: 'Where Conditions',
	name: 'additionalConditions',
	type: 'fixedCollection',
	typeOptions: { multipleValues: true },
	default: {},
	displayOptions: {
		show: {
			operation: ['get','update','delete'],
		},
	},
	options: [
		{
			name: 'groups',
			displayName: 'Condition Group',
			values: [
				/* AND / OR between filters inside this group */
				{
					displayName: 'Logical operators',
					name: 'filterType',
					type: 'options',
					options: [
						{ name: 'AND', value: 'AND' },
						{ name: 'OR', value: 'OR' },
					],
					default: 'AND',
				},
				/* GROUP FILTERS */
				{
					displayName: 'Operatiors',
					name: 'filters',
					type: 'fixedCollection',
					typeOptions: { multipleValues: true },
					default: {},
					options: [
						{
							name: 'fields',
							displayName: 'Filter',
							values: [
								/* MODE SWITCH */
								{
									displayName: 'Mode',
									name: 'mode',
									type: 'options',
									options: [
										{ name: 'Columns from table', value: 'column' },
										{ name: 'SQL Expression ', value: 'expression' },
										{ name: 'IN (Values)', value: 'column_in' },
										{ name: 'NOT IN (Values)', value: 'column_not_in' },
										{ name: 'Between', value: 'between' },
										{ name: 'Not Between', value: 'not_between' },
										{ name: 'Exists', value: 'exists' },
										{ name: 'Not Exists', value: 'not_exists' },
									],
									default: 'column',
								},

								/* === COLUMN MODE === */
								{
									displayName: 'Column',
									name: 'field',
									type: 'options',
									typeOptions: {
										loadOptionsMethod: 'getColumns',
										loadOptionsDependsOn: ['tableId'],
									},
									default: '',
									displayOptions: {
										show: {
											mode: [
												'column',
												'column_in',
												'column_not_in',
												'between',
												'not_between',												
											],
										},
									},
								},
								/* Allowed only for direct compare */
								{
									displayName: 'Operator',
									name: 'operator',
									type: 'options',
									options: [
										{ name: '=', value: 'equal' },
										{ name: '!=', value: 'not_equal' },
										{ name: '>', value: 'greater' },
										{ name: '<', value: 'less' },
										{ name: '>=', value: 'greater_equal' },
										{ name: '<=', value: 'less_equal' },
										{ name: 'Like', value: 'like' },
										{ name: 'Not like', value: 'not_like' },
										{ name: 'Contains', value: 'contains' },																	
										{ name: 'Is null', value: 'is_null' },
										{ name: 'Is not null', value: 'is_not_null' },										
									],
									default: 'equal',
									displayOptions: { show: { mode: ['column'] } },
								},
								{
									displayName: 'Value',
									name: 'value',
									type: 'string',
									default: '',
									displayOptions: { show: { mode: ['column'] } },
								},

								/* === IN / NOT IN === */
								{
									displayName: 'Values (comma-separated)',
									name: 'values',
									type: 'string',
									placeholder: 'A,B,C',
									default: '',
									displayOptions: {
										show: {
											mode: [
												'column_in',
												'column_not_in',
												'between',
												'not_between',
											],
										},
									},
								},
								/* === SUBQUERY === */
								{
									displayName: 'IN/NOT IN SQL Expression',
									name: 'sql',
									type: 'string',
									typeOptions: {
										sqlDialect: 'StandardSQL',
										editor: 'sqlEditor',
										rows: 4,
									},
									default: '',
									placeholder: 'SELECT ID FROM TABLE WHERE...',
									displayOptions: {
										show: {
											mode: ['expression_in', 'expression_not_in'],
										},
									},
								},
								/* === EXISTS === */
								{
									displayName: 'EXISTS / NOT EXISTS SQL Expression',
									name: 'existsQuery',
									type: 'string',
									typeOptions: { rows: 5 },
									default: '',
									placeholder: 'SELECT 1 FROM X WHERE X.ID = MAIN.ID',
									displayOptions: {
										show: { mode: ['exists', 'not_exists'] },
									},
								},

								/* === CUSTOM EXPRESSION === */
								{
									displayName: 'SQL Expression',
									name: 'expression',
									type: 'string',
									typeOptions: {
										sqlDialect: 'StandardSQL',
										editor: 'sqlEditor',
										rows: 3,
									},
									default: '',
									placeholder: '"AGE" > 18 AND "STATUS" = \'A\'',
									displayOptions: {
										show: { mode: ['expression'] },
									},
								},
							],
						},
					],
				},
			],
		},
		],
	},	
];