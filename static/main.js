'use strict';
class Profile {
  constructor (user) {
    this.user = user;
    this.username = user.username;
    this.name = user.name;
    this.password = user.password;
    this.wallet;
  }

  addUser (callback) {
    
    ApiConnector.createUser(this.user, (err, data) => {
      console.log(`Creating user ${this.username}`);
      callback(err, data);
    });
  }

  userAuthorization (callback) {
    ApiConnector.performLogin({username: this.username, password: this.password}, (err, data) => {
      console.log(`Authorizing user ${this.username}`);
      if(!err) console.log(`${this.username} is authorized!`);
      callback(err, data);
    });
  }

  addMoney ({currency, amount}, callback) {
    ApiConnector.addMoney({currency, amount}, (err, data) => {
      console.log(`Adding ${amount} of ${currency} to ${this.username}`);
      if(!err) console.log(`Added ${amount} ${currency} to ${this.username}`);
      this.wallet = data.wallet;
      callback(err, data);
    });
  }

  convertMoney ({fromCurrency, targetCurrency, targetAmount }, callback) {
    console.log(`Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
    ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount }, (err, data) => {
      if(!err) this.wallet = data.wallet;
      callback(err, data);
    });
  }

  transferMoney ({targetUserName, amount}, callback) {
    ApiConnector.transferMoney({to: targetUserName, amount: amount}, (err, data) => {
      console.log(`Transfering ${amount} of Netcoins to ${targetUserName}`);
      callback(err, data);
    });

  }
}

let currency = [];

function getCurrency() {
  currency = [];
  ApiConnector.getStocks((a,b) => {
    currency = b;
  });
}



const Ivan = new Profile({
  username: 'Ivan',
  name: {firstName: 'Ivan', lastName: 'Chernyshev'},
  password: 'ivanspass',
});
const Petya = new Profile({
  username: 'Petya',
  name: {firstName: 'Petya', lastName: 'Petrov'},
  password: 'petyaspass',
});

function main(){
getCurrency();

console.log('Getting stocks info');

Ivan.addUser((err, data) => {
  
  if(!err) {
    console.log(`${data.username} is created!`);

    Ivan.userAuthorization((err, data) => {

      if(!err) {
        Ivan.addMoney({currency: 'EUR', amount: 500000}, (err, data) => {

          if (err) {
            console.error('Error during adding money to Ivan');
          } else {
            let fromCurrency = 'EUR',
            targetCurrency = 'NETCOIN';
            let targetAmount = 500000 * currency[0][`${fromCurrency}_${targetCurrency}`];

            Ivan.convertMoney({fromCurrency: fromCurrency, targetCurrency: targetCurrency, targetAmount: targetAmount}, (err, data) => {
            
              if(err) {
                console.error('Error during adding money to Ivan');
              } else {
                console.log('Converted to coins ', data);

                Petya.addUser((err, data) => {
                  if (!err) {
                    console.log(`${data.username} is created!`);

                    Ivan.transferMoney({targetUserName: Petya.username, amount: Ivan.wallet.NETCOIN}, (err, data) => {
                      if(err) {
                        console.log(err);
                      } else {
                        console.log(`${Petya.username} has a got ${Ivan.wallet.NETCOIN} NETCOINS`)
                      }
                    });

                  }
                });

              }
            });

          }
        });

      }
    });

  }
});


}

main();