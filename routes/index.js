var express = require('express');
var router = express.Router();


var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Log = require('../models/log.js');


/* GET home page. */
router.get('/', function(req, res) {
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		res.render('index', {
			title: '首页',
			posts: posts,
		});
	});
});

router.get('/hello',function(req,res,next)
{
	res.send('Today is '+ new Date().toString());
});

router.get('/list',function(req,res){
	res.render('list',{
		title:"xiaof's List",
		items:[1988,'xiaof','xiao.fly@foxmail.com']
	})
});

router.get('/reg',checklogout);
router.get('/reg',function(req,res){
	res.render('reg',{title:'用户注册'});
});

router.post('/reg',checklogout);
router.post('/reg', function(req, res) {
	//检验用户两次输入的口令是否一致
	if (req.body['password-repeat'] != req.body['password']) {
		req.flash('error', '两次输入的口令不一致');
		return res.redirect('/reg');
	}

	//生成口令的散列值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var newUser = new User({
		name: req.body.username,
		password: password,
	});
	//检查用户名是否已经存在
	User.get(newUser.name, function(err, user) {
		if (user)
			err = 'Username already exists.';
		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}
		//如果不存在则新增用户
		newUser.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success', '注册成功');
			res.redirect('/');
		});
	});
});

router.get('/login',checklogout);
router.get('/login', function(req, res) {
	res.render('login', {
		title: '用户登入',
	});
});
router.post('/login',checklogout);
router.post('/login', function(req, res) {
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		User.get(req.body.username, function(err, user) {
			if (!user) {
				req.flash('error', '用户不存在');
				return res.redirect('/login');
			}
			if (user.password != password) {
				req.flash('error', '用户口令错误');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success', '登入成功');
			res.redirect('/');
		});
	});

router.get('/logout',checkLogin);
router.get('/logout', function(req, res) {
	req.session.user = null;
	req.flash('success', '登出成功');
	res.redirect('/');
});


router.post('/post', checkLogin);
router.post('/post', function(req, res) {
	var currentUser = req.session.user;
	var post = new Post(currentUser.name, req.body.post);
	post.save(function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发表成功');
		res.redirect('/u/' + currentUser.name);
	});
});


router.get('/u/:user', function(req, res) {
	User.get(req.params.user, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		Post.get(user.name, function(err, posts) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('user', {
				title: user.name,
				posts: posts,
			});
		});
	});
});

router.get('/log',function(req,res){
	var log=[];
	Log.get(function(err,logs){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('log',{title:"更新日志",logs:logs});
	})
	
})

router.post('/log',checkLogin);
router.post('/log',checkIsAdmin);
router.post('/log',function(req,res){
	var currentUser = req.session.user;
	var log=new Log('xiaof',req.body.log);
	log.save(function(err){
		if(err)
		{
			req.flash('error',err);
			return res.redirect('/log');
		}
		req.flash('success','更新日志成功');
		return res.redirect('/log');
	})
	
})


function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', '未登入');
		return res.redirect('/login');
	}
	next();
}
function checklogout(req, res, next) {
	if (req.session.user) {
		req.flash('error', '已登入');
		return res.redirect('/');
	}
	next();
}
function checkIsAdmin(req, res,next){
	if (req.session.user && req.session.user.name=='xiaof') {
		//ok
	}
	else{
		req.flash('error', '需要管理员权限');
		return res.redirect('/');
	}
	next();
}


module.exports = router;
