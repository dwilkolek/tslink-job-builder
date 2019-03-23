var kafka = require('kafka-node');
class JobDefinition {
    keys: string[] = [];
    name = 'jobs1';
    sources = {
        sources1: {
            produce: () => {
                console.log('kafka', kafka.Producer);
                const kafkaProducer = kafka.Producer;
                Object.keys(kafkaProducer).forEach(key => {
                    this.keys.push(key);
                })
                return Buffer.from(Math.random().toString());
            }
        }

    };
    sinks = {
        s3: {
            write: function (data: any, encoding: any, done: any) {
                done();
            }
        }
    };
    transformers = {
        s2: {
            transform: function (data: any, encoding: any) {
                var num = parseFloat(data.toString());
                return Math.random() > 0.5 ? Buffer.from((num * 10) + 'asdasdsa') : undefined;
            }
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

export default function() {
    return new JobDefinition();
}