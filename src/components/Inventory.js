import React from 'react';
import AddFishForm from './AddFishForm'
class Inventory extends React.Component{
    constructor(){
        super()
        this.renderInventory = this.renderInventory.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event , key){
        const fish = this.props.fishes[key]
        const updatedFish ={...fish , [event.target.name]:event.target.value}
        this.props.updateFish(key , updatedFish)
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
            </div>
        )
    }
    render(){
        return (
            <div>
                <h3>Inventory</h3>
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish}/>
                <button  onClick ={this.props.loadSamples}>Load sample fishes</button>
            </div>
        )
    }
}
export default Inventory;