import { JobDefinitionInterface } from "./types/job-definition-interface";
import { Readable, Writable, Transform } from "stream";
import { Transformers } from "./transformers";
import { ReadableStream } from "./readable-stream";

var fs = require('fs');
var es = require('event-stream');
module Job {
    class JobDefinition implements JobDefinitionInterface {

        keys: string[] = [];
        name = 'jobs1';
        sources = {
            sources1: {
                get: () => new ReadableStream()

            }
        };
        sinks = {
            s3: {
                get: () => <Writable>fs.createWriteStream('output.json')
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

    module.exports.default = () => {
        return new JobDefinition();
    }
}