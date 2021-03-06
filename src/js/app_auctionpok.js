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

    return App.display();

  },

  display: async function(){
    var Instance = await App.contracts.Uber.deployed();

    try{
      // var out = await Instance.register({from:App.account});
      // var bokka = await Instance.display_pokemons(App.account)
      // console.log(out);
      
        // var pokemons = await Instance.display_pokemons({from:App.account});
        var temp=[];
        var i=0;
        while(true)
        {
          try
          {
            var bokka1 = await Instance.player_pokemon_map.call(App.account,i);
            var bokka=bokka1.toNumber();
            temp.push(bokka1.toNumber());
            i++;
          }
          catch(err)
          {
            console.log(err);
            break;
          }
        }
       $("#regd").html("");
        for(i=0;i<temp.length;i++)
        {
          if(temp[i]!=0)
            App.display_pokemon_id($("#regd"),temp[i]-1);
        }
        console.log(temp);

        // console.log(bokka1);
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
    return App.Auction();
  },

  Auction: async function()
  {
    var Instance = await App.contracts.Uber.deployed();
    try{
      // var out = await Instance.register({from:App.account});
      // var bokka = await Instance.display_pokemons(App.account)
      // console.log(out);
      
        // var pokemons = await Instance.display_pokemons({from:App.account});
        var temp=[];
        var i=0;
        while(true)
        {
          try
          {
            var bokka1 = await Instance.auction_mp.call(i);
            console.log(bokka1);
            console.log(bokka1[0],bokka1[1]['c'][0]);
            temp.push(bokka1[1]['c'][0]);
            // var bokka=bokka1.toNumber();
            // temp.push(bokka1.toNumber());
            i++;
          }
          catch(err)
          {
            console.log(err);
            break;
          }
        }

        $("#trade").html("");
        for(i=0;i<temp.length;i++)
        {
          if(temp[i]!=0)
            App.display_pokemon_id($("#trade"),temp[i]-1);
        }
        
        // $("#trade").append(temp);
        $("#trade").append(" ");
        $("#current").html("");
        if(temp.length>0 && temp[0]!=0)
          App.display_pokemon_id($("#current"),temp[0]-1);
        console.log(temp);
        // console.log(bokka1);
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

  drop: async function(){

    var Instance = await App.contracts.Uber.deployed();
    console.log("hie1");
    try{
      var temp = await Instance.random_drop({from:App.account});
      console.log("hie");
    }
    catch(err)
    {
      console.log(err);
    }
    return App.display();
  },

  PartAuction: async function()
  {
    var Instance = await App.contracts.Uber.deployed();
    var send = document.getElementById("start").value;
    var item=send.split(',');
    var items=[]
    for(var i=0;i<item.length;i++)
      items.push(item[i].toNumber());
    try{
      var temp = await Instance.auction(items,{from:App.account});
      console.log("hie");
    }
    catch(err)
    {
      console.log(err);
    }
    return App.display();
  },

  SendAuction: async function()
  {
    var Instance = await App.contracts.Uber.deployed();
    var send = document.getElementById("stop").value;
    
    try{
      var temp = await Instance.put_in_action(send,{from:App.account});
      console.log("hie");
    }
    catch(err)
    {
      console.log(err);
    }
    return App.display();
  },
  
  Auction_end: async function(){
    var Instance = await App.contracts.Uber.deployed();
    try{
      var temp = await Instance.auction_end({from:App.account});
    }
    catch(err)
    {
      console.log(err);
    }
    return App.display();
  },
  display_pokemon_id: async function(petsRow,i)
  {
    var data = await $.getJSON('../poke.json');
    var petTemplate = $('#petTemplate');
    petTemplate.find('.panel-title').text(data[i].name);
    petTemplate.find('img').attr('src', data[i].picture);
    petTemplate.find('.pok-id').text(data[i].id);
    petTemplate.find('.pok-value').text(data[i].value);
    petsRow.append(petTemplate.html());
  },

};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

$(function() {
  $(window).load(function() {
      App.init();
  });
  // var dropp=setInterval(App.drop,30000);
  var rett=setInterval(App.Auction_end,30000);


});