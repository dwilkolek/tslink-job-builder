import { JobDefinitionInterface } from "./types/job-definition-interface";
import { Readable, Writable, Transform } from "stream";
import { Transformers } from "./transformers";
import { ReadableStream } from "./readable-stream";
import { JobConfig } from "./types/job-config";

var fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
var es = require('event-stream');

module StreamingJob {
    class JobDefinition implements JobDefinitionInterface {

        beforeProcessing = (config: JobConfig, workspace: string, done: () => void) => {
            fsPromises.copyFile(config.jobParams['from'], path.join(workspace, config.jobParams['to']))
                .then(() => {
                    console.log(`suc: ${config.jobParams['from']} was copied to ${path.join(workspace, config.jobParams['to'])}`);
                    done();
                })
                .catch(() => {
                    console.log(`err: ${config.jobParams['from']} was not copied to ${path.join(workspace, config.jobParams['to'])}`)
                });
        };

        _isDone = false;
        keys: string[] = [];
        name = 'jobs1';
        sources = {
            sources1: {
                get: (config: JobConfig, workspace: string) => new ReadableStream(path.join(workspace, config.jobParams['to']))

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
        isDone = () => {
            return this._isDone;
        }
    }

    module.exports.default = () => {
        return new JobDefinition();
    }
}