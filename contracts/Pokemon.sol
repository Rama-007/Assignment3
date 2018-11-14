pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract Pokemon{
    
    mapping (address=>uint[]) public player_pokemon_map;
    
    mapping (uint=>address) public player_index; 
    uint public player_count;
    address public owner;
    uint public pokemon_count;
    uint public max_auction=0;
    address public max_auction_address;
    uint[] public max_auction_items;
    
    event dropped(uint id);

    struct auction_items
    {
        address owners;
        uint id;
    }
    
    struct transfer_items
    {
        address owners;
        uint sent_id;
        uint want_id;
        uint time;
    }
    
    auction_items[] public auction_mp;
    transfer_items[] public transfer_mp;
    
    constructor() payable
    {
        owner=msg.sender;
        player_count=0;
        pokemon_count=10;
        
    }



    function random_number(uint count) returns (uint)
    {
        return uint256(keccak256(block.timestamp, block.difficulty))%count+1;
    }
    
    mapping (address => bool) public registered_players;
    

    function register () public returns (bool)
    {

        require(registered_players[msg.sender]!=true,"Already registered");
        require(msg.sender!=owner,"owner cant register");        
        registered_players[msg.sender]=true;

        player_pokemon_map[msg.sender].push(random_number(pokemon_count));
        player_index[player_count]=msg.sender;
        player_count++;
        return registered_players[msg.sender];
    }


    function isRegistered() public view returns(bool) {
        return registered_players[msg.sender];
    }

   function length_of_array() public returns(uint)
    {
        return player_pokemon_map[msg.sender].length;
    } 


    function display_pokemons() public returns (uint[])
    {
        require(registered_players[msg.sender]==true,"Not registered");
        return player_pokemon_map[msg.sender];
    }
    
    function random_drop() public
    {
        uint ids=random_number(pokemon_count);
        player_pokemon_map[player_index[random_number(player_count)]].push(ids);
        emit dropped(ids);
    }
    
    function id_in_address(uint id, address addr) public returns (bool)
    {
        for(uint i=0;i<player_pokemon_map[addr].length;i++)
        {
            if(player_pokemon_map[addr][i]==id)
            {
                return true;
            }
        }
        return false;
    }
    
    function remove(address addr, uint id) public
    {
        for(uint i=0;i<player_pokemon_map[addr].length;i++)
        {
            if(player_pokemon_map[addr][i]==id)
            {
                delete player_pokemon_map[addr][i];
                break;
            }
        }
    }
    
    function put_in_action(uint id) public
    {
        require(id_in_address(id,msg.sender)==true, "Doesnot have that pokemon");
        auction_mp.push(auction_items(msg.sender,id));
        remove(msg.sender,id);
    }
    
    function auction(uint[] items) public
    {
        require(auction_mp.length>0,"No item in Auction");
        require(msg.sender!=auction_mp[0].owners);
        uint temp=0;
        for(uint i=0;i<items.length;i++)
        {
            require(id_in_address(items[i],msg.sender)==true,"not owner");
            temp+=items[i]+2;
        }
        if(max_auction<temp)
        {
            max_auction=temp;
            max_auction_items=items;
            max_auction_address=msg.sender;
        }
    }
    function auction_end() public
    {
        require(auction_mp.length>0);
        if(max_auction!=0)
        {
            max_auction=0;
            for(uint i=0;i<max_auction_items.length;i++)
            {
                remove(max_auction_address,max_auction_items[i]);
                player_pokemon_map[auction_mp[0].owners].push(max_auction_items[i]);
            }
            player_pokemon_map[max_auction_address].push(auction_mp[0].id);
            delete auction_mp[0];
        }
        else
        {
            player_pokemon_map[auction_mp[0].owners].push(auction_mp[0].id);
            delete auction_mp[0];
        }
    }
    
    function put_in_transfer(uint id1,uint id2) public
    {
        require(id_in_address(id1,msg.sender)==true, "Doesnot have that pokemon");
        remove(msg.sender,id1);
        uint flag=0;
        for(uint i=0;i<transfer_mp.length;i++)
        {
            if(transfer_mp[i].sent_id==id2 && transfer_mp[i].want_id==id1)
            {
                player_pokemon_map[transfer_mp[i].owners].push(id1);
                player_pokemon_map[msg.sender].push(id2);
                delete transfer_mp[i];
                flag=1;
                break;
            }
        }
        if(flag==0)
        {
            transfer_mp.push(transfer_items(msg.sender,id1,id2,now));
        }
        
    } 
    
    function transfer_not_happened() public
    {
        for(uint i=0;i<transfer_mp.length;i++)
        {
        /*    if(now - transfer_mp[i].time > 500)
            {
                player_pokemon_map[transfer_mp[i].owners].push(transfer_mp[i].sent_id);
                delete transfer_mp[i];
            }
            else
            {
                break;
            }
        */
        player_pokemon_map[transfer_mp[i].owners].push(transfer_mp[i].sent_id);
        delete transfer_mp[i];
        break;
        }
    }
    
    
}