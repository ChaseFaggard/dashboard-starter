/**
 * @author Chase Faggard 
 * 
 * Handles all functions related to dealing with the M3O Database API
 * Includes 
 *  - Get all records of a table
 *  - Getting record by id & key/value query
 *  - Delete record by id & key/value query
 *  - Create record
 */

import { M3O_TOKEN } from './constants.js'
import { apiClientWithToken } from './apiclient.js'

class Database {

    static #BASE_URL = 'https://api.m3o.com/v1/db'

    /**
     * Returns all records of a given table.
     * @usage const records = await Database.getAllRecords('tableName')
     *
     * @param {string} table The name of the table to search
     * @return {object[]} An array of record objects
     */
    static getAllRecords = async (table) => {
        try {
            const res = await apiClientWithToken(this.#BASE_URL, M3O_TOKEN).post('/Read', {
                table: table
            })
            return res.data.records
        } catch(e) { console.error(e) }
    }

    /**
     * Returns all records of a given table by a key-value pair
     * @usage const records = await Database.getAllRecords('tableName', 'key', 'value')
     *
     * @param {string} table The name of the table to search
     * @param {string} key The key to search for
     * @param {strin} value The value to match the key
     * @return {object[]} An array of record objects
     */
     static getAllRecordsByKey = async (table, key, value) => {
        try {
            const res = await apiClientWithToken(this.#BASE_URL, M3O_TOKEN).post('/Read', {
                query: `${key} == '${value}'`,
                table: table
            })
            return res.data.records
        } catch(e) { console.error(e) }
    }

    /**
     * Returns a single record by query.
     * @usage const record = await Database.getRecord('tableName','key','value')
     *
     * @param {string} table The name of the table to search
     * @param {string} id The id of the record to find.
     * @return {object} The record object found
     */
     static getRecord = async (table, key, value) => {
        try {
            const res = await apiClientWithToken(this.#BASE_URL, M3O_TOKEN).post('/Read', {
                query: `${key} == '${value}'`,
                table: table
            })
            return res.data.records[0]
        } catch(e) { console.error(e) }
    }

    /**
     * Returns a single record by id.
     * @usage const record = await Database.getRecordById('tableName','id')
     *
     * @param {string} table The name of the table to search
     * @param {string} id The id of the record to find.
     * @return {object} The record object found
     */
    static getRecordById = async (table, id) => {
        try {
            const res = await apiClientWithToken(this.#BASE_URL, M3O_TOKEN).post('/Read', {
                id: id,
                table: table
            })
            return res.data.records[0]
        } catch(e) { console.error(e) }
    }

    /**
     * Creates a record.
     * @usage await Database.createRecord('tableName','record')
     *
     * @param {string} table The name of the table to put the record in
     * @param {object} record The record object to create in the db
     */
     static createRecord = async (table, record) => {
        try {
            await apiClientWithToken(this.#BASE_URL, M3O_TOKEN).post('/Create', {
                record: record,
                table: table
            })
        } catch(e) { console.error(e) }
    }

    /**
     * Update a record.
     * @usage await Database.createRecord('tableName','record')
     *
     * @param {string} table The name of the table the record is in
     * @param {object} record The updated record - make sure to include the id
     */
    static updateRecord = async (table, record) => {
        try {
            await apiClientWithToken(this.#BASE_URL, M3O_TOKEN).post('/Update', {
                record: record,
                table: table
            })
        } catch(e) { console.error(e) }
    }

    /**
     * Deletes a record by its id.
     * @usage await Database.deleteRecordById('tableName','id')
     *
     * @param {string} table The name of the table to search
     * @param {string} id The id of the record to delete
     */
    static deleteRecordById = async (table, id) => {
        try {
            await apiClientWithToken(this.#BASE_URL, M3O_TOKEN).post('/Delete', {
                id: id,
                table: table
            })
        } catch(e) { console.error(e) }
    }

    /**
     * Deletes a record given a matching key - value pair.
     * @usage await Database.deleteRecord('tableName','key','value')
     *
     * @param {string} table The name of the table to search
     * @param {string} key The key to search
     * @param {string} value The value to search
     */
     static deleteRecord = async (table, key, value) => {
        const records = await Database.getAllRecords(table)
        for(let record of records) {
            if(record[key] && record[key] == value) await Database.deleteRecordById(table, record.id)
        }
    }

    /**
     * Deletes a table
     * @usage await Database.dropTable('tableName')
     *
     * @param {string} table The name of the table to delete
     */
     static deleteRecord = async (table, key, value) => {
        try { 
            await apiClientWithToken(this.#BASE_URL, M3O_TOKEN).post('/DropTable', { 
                table: table 
            }) 
        } 
        catch(e) { console.error(e) }
    }


}

export default Database
