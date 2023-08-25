import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3005;

app.use(bodyParser.text({ type: ['text/*', '*/json'], limit: '50mb' }))

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// TODO: change this according your needs
const sentryKey = '1cde1991677ab0bee929938ca9136004';
const sentryHost = 'o4505635479945216.ingest.sentry.io';
const projectId = '4505635481190400';

app.post('/tunnel', async (req, res) => {
    try {
        const envelope = req.body;
        const url = `https://${sentryHost}/api/${projectId}/envelope/?sentry_key=${sentryKey}`;
        const options = {
            'headers': {
                'Content-Type': 'application/x-sentry-envelope'
            }
        };

        const response = await axios.post(url, envelope, options);

        res.status(201).json({ message: "Success", data: response?.data })
    } catch (e) {
        const error = e?.response || e?.message;
        res.status(400).json({ message: 'invalid request', error: error });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
