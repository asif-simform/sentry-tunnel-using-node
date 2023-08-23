import express from 'express';
import request from 'request';
import bodyParser from 'body-parser';

const app = express();
const port = 3005;

app.use(bodyParser.text({ type: ['text/*', '*/json']}))

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/tunnel', (req, res) => {
    const envelope = req.body;

    // https://1cde1991677ab0bee929938ca9136004@o4505635479945216.ingest.sentry.io/4505635481190400
    const auth = '1cde1991677ab0bee929938ca9136004';
    const sentryHost = 'o4505635479945216.ingest.sentry.io';
    const projectId = '4505635481190400';
    const url = `https://${auth}@${sentryHost}/api/${projectId}/envelope/`;

    const options = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Content-Type': 'application/x-sentry-envelope'
        },
        body: envelope
    };
    request(options, function (error, response) {
        if (error) {
            const message =  error?.response || error?.message;
            res.status(422).json({ message: "Something went wrong", error: message });
        } else {
            res.status(201).json({ message: "Success", data: response?.body })
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
