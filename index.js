
//codigo da api e suas configurações

const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors') //cors permite enviar mensagens entre portas e dominios diferentes

const configuration = new Configuration({
    organization: "org-YiDpqW9gpzgTElAzSrZVaskX",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
//const response = await openai.listEngines();


const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 3080

app.post('/', async (req, res) => {
    const { message,currentModel } = req.body;
    const response = await openai.createCompletion({
        model: `${currentModel}`,//"text-davinci-003",
        prompt: `${message}`,
        max_tokens: 200,
        temperature: 0,
      }); 
      
      res.json({
        message: response.data.choices[0].text,
      })
});

app.get('/models', async (req, res) => {
  const response = await openai.listEngines();
  console.log(response.data.data)
  res.json({
    models: response.data.data
  })
});

app.listen(port, () => {
    console.log(`example app listening at http://localhost:${port}`)
});

/*onChange={(e) => {
            setCurrentModel(e.target.value);
          }} */