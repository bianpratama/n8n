import { Db, FilterQuery } from 'mongodb';
import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, JsonObject } from 'n8n-workflow';

export async function deleteOps(this: IExecuteFunctions, mdb: Db): Promise<INodeExecutionData[]> {
	try {
		const collection = this.getNodeParameter('collection', 0) as string;
		const filterQuery = JSON.parse(this.getNodeParameter('query', 0) as string);

		const { deletedCount } = await mdb.collection(collection).deleteMany(filterQuery);

		return this.helpers.returnJsonArray([{ deletedCount }]);
	} catch (error: any) {
		if (this.continueOnFail()) {
			return this.helpers.returnJsonArray({ error: (error as JsonObject).message });
		} else {
			throw error;
		}
	}
}
