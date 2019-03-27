import { Readable, Writable, Transform } from "stream";
import { Transformers } from "./transformers";
import { ReadableStream } from "./readable-stream";
import { JobContext } from "./types/job-context";
import { IJobDefinition } from "./types/job-definition";
var fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
var es = require('event-stream');

module BatchModule {
    class BatchJob implements IJobDefinition {
        readStr: Readable;
        constructor(context: JobContext) {
            this.readStr = new ReadableStream(path.join(context.workspaceDirectory, context.jobConfig.jobParams['to']));
            setTimeout(() => {
                this.readStr.push(null)
            }, 10000)
        }

        timeout: any;

        beforeProcessing = (context: JobContext, done: () => void) => {
            console.log('beforeProcessing')
            done();
        };
        afterProcessing = (context: JobContext, done: () => void) => {
            console.log('afterProcessing')
            done();
        }
        
        keys: string[] = [];
        name = 'jobs1';
        sources = {
            sources1: {
                get: (context: JobContext) => this.readStr
            }
        };
        sinks = {
            s3: {
                get: (context: JobContext) => <Writable>fs.createWriteStream(path.join(context.workspaceDirectory, context.jobConfig.jobParams['output']))
            }
        };
        transformers = {
            s2: {
                get: () => new Transformers()
            }
        };
        connections = [{
            from: 'sources1',
            to: {
                name: 's2',
                to: {
                    name: 's3'
                }
            }
        }];
    }


    module.exports.beforeCreate = (context: JobContext, done: () => void) => {
        console.log('beforeCreation');
        fsPromises.copyFile(context.jobConfig.jobParams['from'], path.join(context.workspaceDirectory, context.jobConfig.jobParams['to']))
            .then(() => {
                console.log(`suc: ${context.jobConfig.jobParams['from']} was copied to ${path.join(context.workspaceDirectory, context.jobConfig.jobParams['to'])}`);
                done();
            })
            .catch(() => {
                console.log(`err: ${context.jobConfig.jobParams['from']} was not copied to ${path.join(context.workspaceDirectory, context.jobConfig.jobParams['to'])}`);
                done();
            });
    }

    module.exports.default = (context: JobContext) => {
        console.log('default');
        return new BatchJob(context);
    }
    module.exports.afterDestroy = (context: JobContext) => new Promise(resolve => {
        console.log('afterDestroy');
        resolve();
    })
}