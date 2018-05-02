import React from 'react';
import {getFunName} from '../helpers' 
class StorePicker extends React.Component{
    constructor(){
        super()
        this.goToStore = this.goToStore.bind(this)
    }
    goToStore(event){
        event.preventDefault();
        console.log("You changed the url")
        const storeId = this.StoreInput.value;
        this.context.router.transitionTo(`/store/${storeId}`)

    }
    render(){
        return (
            <form className="store-selector" action=""  onSubmit={this.goToStore} >
                <p>Please Enter A Store </p>
                
                <input type="text" required placeholder="Store Name"  defaultValue={getFunName()} ref={ (input) => {this.StoreInput = input}}/>
                <button type="submit"> Visit store -> </button>
            </form>
        )
    }
}


StorePicker.contextTypes = {
    router : React.PropTypes.object,
}

export default StorePicker;