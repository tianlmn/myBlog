var express = require('express');
var router = express.Router();

/* GET users listing. */
var users = {
	'xiaof':{
		name:'xiaof',
		age:27
	},
	'zhangyn':{
		name:'zhangyn',
		age:27
	}
};

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.all('/:user',function(req,res,next){
	if(users[req.params.user])
	{
		next();
	}
	else
	{
		next(new Error(req.params.user + ' does not exist.'));
	}
})

router.get('/:user', function(req, res, next) {
  res.send(JSON.stringify(users[req.params.user]));
});

router.put('/:user',function(req,res){
	res.send("done");
})

module.exports = router;
