import React from 'react';
import Header from './Header'
import Order from './Order'
import Inventory from './Inventory'
import SampleFishes from '../sample-fishes'
import Fish from './Fish'
import base from '../base'

class App extends React.Component{
    constructor(){
        super()
        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(fish);
        this.state = {
            fishes:{},
            order:{},
        }
    }
    componentWillMount(){
        //runs before the <App/> is rendereed
        this.ref = base.syncState(`${this.props.params.storeid}/fishes/`,{context:this, state:'fishes'});
        //checks if there is any order in localStorage
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeid}`)
        if(localStorageRef){
            //update our <App/> component's order state
            this.setState(
                { order : JSON.parse(localStorageRef)}
            )
        }
    }
    componentWillUpdate(nextProps, nextState){
        localStorage.setItem(`order-${this.props.params.storeid}`, JSON.stringify(nextState.order))
    }
    componentWIllUnMount(){  
        base.removeBinding(this.ref);
    }
    addFish(fish){
        const fishes = {...this.state.fishes}
        const timestamp = Date.now()
        fishes[`fish-${timestamp}`] = fish
        this.setState({fishes})
    }
    updateFish(key , updatedFish){
        const fishes = {...this.state.fishes}
        console.log("Before" +fishes[key].status)
        fishes[key] = updatedFish
        this.setState({fishes})
        console.log("After" +this.state.fishes[key].status)
    }
    removeFish(key){
        const fishes ={...this.state.fishes}
        fishes[key] = null;
        this.setState({fishes})
    }
    loadSamples(){
        this.setState({fishes: SampleFishes})
    }
    addToOrder(key){
        const order = {...this.state.order}
        order[key] = order[key] + 1 || 1;
        this.setState({order})
    }
    render(){
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh sea food market"/>
                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes).map(key => <Fish key={key} details={this.state.fishes[key]} index={key} addToOrder={this.addToOrder}/> )}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} />
                <Inventory 
                    addFish={this.addFish} 
                    fishes={this.state.fishes} 
                    loadSamples = {this.loadSamples}
                    updateFish={this.updateFish}
                />
            </div>
        )
    }
}
export default App;