import { Db } from 'mongodb';
import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData, JsonObject } from 'n8n-workflow';
import { handleObjectId } from './MongoDb.node.utils';
import { ObjectID } from 'mongodb';

export async function aggregateOps(this: IExecuteFunctions, mdb: Db): Promise<INodeExecutionData[]> {
	try {
		const queryParameter = JSON.parse(this.getNodeParameter('query', 0) as string);

		if (queryParameter._id && typeof queryParameter._id === 'string') {
			queryParameter._id = new ObjectID(queryParameter._id);
		}

		const query = mdb
			.collection(this.getNodeParameter('collection', 0) as string)
			.aggregate(queryParameter);

		const queryResult = await query.toArray();

		return this.helpers.returnJsonArray(queryResult as IDataObject[]);
	} catch (error: any) {
		if (this.continueOnFail()) {
			return this.helpers.returnJsonArray({ error: (error as JsonObject).message } );
		} else {
			throw error;
		}
	}
}
