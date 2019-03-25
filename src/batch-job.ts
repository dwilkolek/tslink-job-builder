import { JobDefinition } from "./types/job-definition";
import { Readable, Writable, Transform } from "stream";
import { Transformers } from "./transformers";
import { ReadableStream } from "./readable-stream";
import { JobConfig } from "./types/job-config";

var fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
var es = require('event-stream');

module BatchJob {
    class JobDefinition implements JobDefinition {
        readStr: Readable;
        constructor(config: JobConfig, workspace: string) {
            this.readStr = new ReadableStream(path.join(workspace, config.jobParams['to']));
            setTimeout(() => {
                this.readStr.push(null)
            }, 10000)
        }

        timeout: any;

        beforeProcessing = (config: JobConfig, workspace: string, done: () => void) => {
            console.log('beforeProcessing')
            done();
        };
        afterProcessing = (config: JobConfig, workspace: string, done: () => void) => {
            console.log('afterProcessing')
            done();
        }
        
        keys: string[] = [];
        name = 'jobs1';
        sources = {
            sources1: {
                get: (config: JobConfig, workspace: string) => this.readStr
            }
        };
        sinks = {
            s3: {
                get: (config: JobConfig, workspace: string) => <Writable>fs.createWriteStream(path.join(workspace, config.jobParams['output']))
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


    module.exports.beforeCreate = (config: JobConfig, workspace: string, done: () => void) => {
        console.log('beforeCreation');
        fsPromises.copyFile(config.jobParams['from'], path.join(workspace, config.jobParams['to']))
            .then(() => {
                console.log(`suc: ${config.jobParams['from']} was copied to ${path.join(workspace, config.jobParams['to'])}`);
                done();
            })
            .catch(() => {
                console.log(`err: ${config.jobParams['from']} was not copied to ${path.join(workspace, config.jobParams['to'])}`);
                done();
            });
    }

    module.exports.default = (config: JobConfig, workspace: string) => {
        console.log('default');
        return new JobDefinition(config, workspace);
    }
    module.exports.afterDestroy = (config: JobConfig, workspace: string) => new Promise(resolve => {
        console.log('afterDestroy');
        resolve();
    })
}