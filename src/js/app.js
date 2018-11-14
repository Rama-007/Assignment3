App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  Booked : false,
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Pokemon.json", function(uber) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Uber = TruffleContract(uber);
      // Connect provider to interact with contract
      App.contracts.Uber.setProvider(App.web3Provider);

      // App.listenForEvents();
      return App.render();
    });
  },
  render: async function() {

    var regd = $("#regd"); 

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });


  },

  Register: async function(){
    var Instance = await App.contracts.Uber.deployed();

    try{
      // var out = await Instance.register({from:App.account});
      // var bokka = await Instance.display_pokemons(App.account)
      // console.log(out);
      $("#regd").html("");

      var bokka1 = await Instance.registered_players.call(App.account);

      if(bokka1==true)
        window.location.href = "index1.html";

      var isRegistered = await Instance.register({from:App.account});
      var bokka = await Instance.registered_players.call(App.account);

      console.log(bokka);
      window.location.href = "index1.html";
      if(bokka==true)
      {
        // var pokemons = await Instance.display_pokemons({from:App.account});
        var temp=[];
        var i=0;
        
        while(true)
        {
          try
          {
            var bokka1 = await Instance.player_pokemon_map.call(App.account,i);
            temp.push(bokka1.toNumber());
            i++;
          }
          catch(err)
          {
            break;
          }
        }
        console.log(temp);
        // console.log(bokka1);
      }
      // console.log(temp);
      // if(isRegistered==true)
      //   regd.append("Already Registered !! congrats !!!");
      // else
      // {

      //   var temp = await Instance.register({from:App.account});
      //   console.log(temp);
      //   regd.append("Registered !! congrats !!!");
      //   isRegistered = await Instance.isRegistered({from:App.account});
      //   console.log(isRegistered);
      // }
      // else
      //   regd.append("Already Register ayyav ra pooka!!");
    }
    catch(err)
    {
      console.log(err);
      regd.append("Lanjodka !! Madda guduvu !!!");
    }
  },
  
  
};

$(function() {
  $(window).load(function() {
      App.init();
  });
});