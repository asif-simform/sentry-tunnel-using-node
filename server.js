import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3005;

app.use(bodyParser.text({ type: ['text/*', '*/json'], limit: '50mb' }))

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/tunnel', async (req, res) => {
    try {
        const envelope = req.body;

        const pieces = envelope.split('\n');

        const header = JSON.parse(pieces[0]);

        const { host, pathname, username } = new URL(header.dsn);

        const projectId = pathname.slice(1);

        const url = `https://${host}/api/${projectId}/envelope/?sentry_key=${username}`;

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
