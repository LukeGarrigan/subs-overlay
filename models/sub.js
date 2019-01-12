

exports.updateSubscriberBadgeByName = function(sql, subscriberBadgeDto) {
  let query = `update subs set time_subscribed = '${subscriberBadgeDto.badge}' where username = '${subscriberBadgeDto.username}'`;
  let result = sql.query(query);

  result.then(data => {
    console.log("successfully updated players badge");
  }).catch(err => {
    console.log(err);
  });
};


exports.createNewSub = function(sub, sql) {
  let query = `begin 
      if not exists (select * from subs
                      where username = '${sub.name}')
      begin
            insert into subs (username, experience, lvl) 
            values ('${sub.name}',0,1)            
      end
  end`;

  let output = sql.query(query);

  output.then(result => {
  }).catch(err => {
    console.log(err);
    console.log("error adding " + sub.name);
  });

}

exports.updatePersistedSub = function(sub, sql) {
  let query = `update subs set experience = '${sub.xp}' where username = '${sub.name}'`;

  let result = sql.query(query);

  result.then(data => {

  }).catch(err => {
  });
}
