const babel = require('babel-register');
const mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./assets/config')
const express = require('express');
const app = express();

    //Router
let MembersRouter = express.Router();

    //module
const {success, error} = require('./assets/functions');

    //middleware
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

    //database config
const db = mysql.createConnection({

    host: 'localhost',
    database: 'nodejs',
    user: 'root',
    password: ''
})

db.connect((err) => {

    if(err)
        {
            console.log(err.message)
        }

    else
        {
            console.log('db connected successfuly');
        }
})

    //operation sur les membre stocke dans un array
var members = [

    {
        id : 1,
        name : 'aaa'
    },

    {
        id : 2,
        name : 'bbb'
    },

    {
        id : 3,
        name : 'ccc'
    }
]


/***************************************************************************/
//                   start server ***home
/***************************************************************************/
    //accueil
    app.get('/', (req, res) => {

        // res.setHeader('content-type', 'text/plain');
        res.status(200).json('salut DK-codeur, bienvenue !');
    });


    //recup un membre : **GET** simple instrution
// app.get('/v1/members/:id', (req, res) => {

//     res.json(success(members[(req.params.id)-1]));
// });

MembersRouter.route('/:id')

        //recup un membre : **GET**autre meth
    .get( (req, res) => {

        //verifie les id entre ds l'url
        let index = getId(req.params.id)

        if(typeof(index) == 'string')
            {
                res.json(error(index));
            }

        else
            {
                res.json(success(members[index]));
            }

    })


    //**PUT**
    .put( (req, res) => {

        //verifie les id entre ds l'url
    let index = getId(req.params.id)

    if(typeof(index) == 'string')
        {
            res.json(error(index));
        }

    else
        {
            let reqok = true;

            for(let i = 0; i < members.length; i++)
                {
                        //les cas d'erreur
                    if(req.body.name == members[i].name && req.param.id != members[i].id)
                        {
                            reqok = false;
                            break;
                        }
                }

            if(reqok)
                {
                    members[index].name = req.body.name;
                    res.json(success(true));
                }

            else
                {
                    res.json(error('ERROR to PUT'))
                }
        }
        
    })


    //**delete
    .delete( (req, res) => {

        let index = getId(req.params.id)

        if(typeof(index) == 'string')
            {
                res.json(error(index));
            }

        else
            {
                members.splice(index, 1);
                res.json(success(members));
            }
    });
// ********end MembersRoute.route(':/id')********


MembersRouter.route('/')

        //GET**recup tous
    .get( (req, res ) => {
        
        if(req.query.max != undefined && req.query.max > 0)
            {
                res.json(success(members.slice(0, req.query.max)));
            }

        else if(req.query.max != undefined)
            {
                res.json(error('valeur de max incorrect'));
            }

        else
            {
                res.json(success(members));
            }
    })

        //**post**
    .post( (req, res) => {

        if(req.body.name)
            {
                let sameName = true; //var temoin for mm nom

                for(let i = 0; i < members.length; i++)
                    {
                        if(members[i].name == req.body.name)
                            {   
                                res.json(error('ERROR name already exist'));
                                sameName = false;
                                break;
                            }
                    }

                if(sameName)
                    {
                        let newMember = {

                            id: createId(),
                            name: req.body.name
                        }
            
                        members.push(newMember);
                        res.json(success(newMember));
                    }
            }

        else    
            {
                res.json(error('ERROR to add'))
            }

    });
// ********end MembersRoute.route('/')********

   
//************************************************************
//                      function
//************************************************************

    //function index = (req.params.id)-1
function getId(id)
    {
        for(let i=0; i<members.length; i++)
            {
                if(members[i].id == id)
                    {
                        return i;
                    }  
            }
                //un else
            return 'id errone ou invalide';
    }

        //createId :members.length+1
function createId()
    {
        return members[members.length-1].id + 1;
    }

/***************************************************************************/
//                   Router use
/***************************************************************************/
    
app.use(config.rootApp+'members', MembersRouter);


/***************************************************************************/
//                   end server***error
/***************************************************************************/
    //erreurs
app.use((req, res, next) => {

    // res.setHeader('content-type', 'text/plain'); en commentair pae json
    res.status(400).json('page introuvable !');
    next();
});

    //port
app.listen(config.port, () => console.log('app tourne sur '+config.port));

