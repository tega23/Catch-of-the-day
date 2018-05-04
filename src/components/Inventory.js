import React from 'react';
import AddFishForm from './AddFishForm'
import base from '../base'
class Inventory extends React.Component{
    constructor(){
        super()
        this.renderInventory = this.renderInventory.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.renderLogin = this.renderLogin.bind(this)
        this.authenticate = this.authenticate.bind(this)
        this.authHandler = this.authHandler.bind(this)
        this.logout = this.logout.bind(this)
        this.state ={
            uid:null,
            owner:null,
        }
    }
    componentDidMount(){
        base.onAuth((user)=>{
            if(user){
                this.authHandler(null,{user})
            }
        })
    }
    logout(){
        base.unauth()
        this.setState(
            {uid:null,}
        )
    }
    handleChange(event , key){
        const fish = this.props.fishes[key]
        const updatedFish ={...fish , [event.target.name]:event.target.value}
        this.props.updateFish(key , updatedFish)
    }
    authenticate(provider){
        console.log(`Trying to log in with ${provider}`)
        base.authWithOAuthPopup(provider, this.authHandler)
    }
    authHandler(err, authData){
        console.log(authData)
        if(err){
            console.error(err)
            return
        }
        //grab the store information
        const storeRef = base.database().ref(this.props.storeid)
        //query the database for the stored data
        storeRef.once('value',(snapshot) =>{
            const data = snapshot.val() ||{}
            //claim as our own if theres no owner already 
            if (!data.owner){
                storeRef.set({owner:authData.user.uid})
            }
            this.setState({
                uid:authData.user.uid,
                owner: data.owner || authData.user.uid,
            })

        } )
        

    }

    
    renderLogin(){
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign uo to manage store inventory</p>
                <button className="github" onClick={()=>{this.authenticate('github')}}>Login with github </button>
                <button className="facebook" onClick={()=>{this.authenticate('facebook')}}>Login with facebook </button>
                <button className="twitter" onClick={()=>{this.authenticate('twitter')}}>Login with twitter </button>
            </nav>
        )
    }
    renderInventory(key){
        const fish = this.props.fishes[key]

        return(
            <div className="fish-edit" key={key}>
                <input name="name" type="text" placeholder='Fish Name' value={fish.name} onChange={(e)=>this.handleChange(e,key)} />
                <input name="price" type="text" placeholder='Fish Price' value={fish.price} onChange={(e)=>this.handleChange(e,key)} />
                <select name="status" value={fish.status} onChange={(e)=>this.handleChange(e,key)}>
                    <option value='available'>Fresh</option>
                    <option value='unavailable'>Sold Out!</option>
                </select>
                <textarea name="desc" placeholder="Fish Desc..." value={fish.desc} onChange={(e)=>this.handleChange(e,key)}></textarea>
                <input name="image" type="text" placeholder='Fish Image' value={fish.image} onChange={(e)=>this.handleChange(e,key)}/>
                <button onClick={()=>this.props.removeFish(key)}>Remove fish</button>
            </div>
        )
    }
    render(){
        const logout = <button onClick={this.logout}>Log out!</button>
        if(!this.state.uid){
            return (<div>{this.renderLogin()}</div>)
        }
        if(this.state.uid !== this.state.owner){
            return (
                    <div>
                        Sorry you aren't the owner of this store
                        {logout}
                    </div>
            )    
        }
        return (
            <div>
                <h3>Inventory</h3>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish}/>
                <button  onClick ={this.props.loadSamples}>Load sample fishes</button>
            </div>
        )
    }
}
Inventory.propTypes ={
    fishes:React.PropTypes.object.isRequired,
    updateFish:React.PropTypes.func.isRequired,
    removeFish:React.PropTypes.func.isRequired,
    addFish:React.PropTypes.func.isRequired,
    loadSamples:React.PropTypes.func.isRequired,
};
export default Inventory;