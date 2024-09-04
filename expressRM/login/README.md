# login

// Session-persisted message middleware
```
app.use(function(req, res, next){
var err = req.session.error;
var msg = req.session.success;
delete req.session.error;
delete req.session.success;
res.locals.message = '';
if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
next();
});
```
// dummy database
```
var users = {
tj: { name: 'tj' }
};
```
// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

```
hash('foobar', function(err, salt, hash){
if (err) throw err;
// store the salt & hash in the "db"
users.tj.salt = salt;
users.tj.hash = hash;
});
```

// Authenticate using our plain-object database of doom!

```
function authenticate(name, pass, fn) {
if (!module.parent) console.log('authenticating %s:%s', name, pass);
var user = users[name];
if (!user) return fn(new Error('cannot find user'));
hash(pass, user.salt, function(err, hash){
if (err) return fn(err);
if (hash == user.hash) return fn(null, user);
fn(new Error('invalid password'));
});
}
```
```
function restrict(req, res, next) {
if (req.session.user) {
next();
} else {
req.session.error = 'Access denied!';
res.redirect('/login');
}
}
```
