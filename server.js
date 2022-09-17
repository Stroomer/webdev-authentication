import express from 'express';
import bcrypt, { hash } from 'bcrypt';

const app    = express();

const users  = [];



app.use(express.json());

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', async (req, res) => {
    try {
        const salt           = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);
        const user = { name:req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/users/login', async (req, res) => {
    
    console.log(users);
    
    const user = users.find(user => user.name = req.body.name);
    if(user === null) {
        console.log('cannot find user');
        return res.status(400).send('Cannot find user');
    }
    try {
        console.log('yoyo');
        console.log(req.body.password);
        console.log(user.password);

        if(await bcrypt.compare(req.body.password, user.password)) {
            console.log('success');
            res.send('Success');       
        }else{
            console.log('not allowed');
            res.send('Not allowed');
        }
    } catch {
        console.log('500');
        res.status(500).send();
    }
});

app.listen(3000);



// https://youtu.be/Ud5xKCYQTjM?t=321