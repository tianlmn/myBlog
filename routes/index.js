var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello',function(req,res,next)
{
	res.send('Today is '+ new Date().toString());
})

router.get('/list',function(req,res){
	res.render('list',{
		title:"xiaof's List",
		items:[1988,'xiaof','xiao.fly@foxmail.com']
	})
})

router.get('/reg',function(){
	res.render('reg',{title:'Signup'});
})

module.exports = router;
