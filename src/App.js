import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App(){
  const [addFriendIsOpen,setAddFriendIsOpen]=useState(false);
  const [friendList,setFriendList]=useState(initialFriends);
  const [showBillForm,setShowBillForm]=useState(false);
  const [selectedFriend,setSelectedFriend]=useState('');
  function handleFriendForm(){
    setAddFriendIsOpen(!addFriendIsOpen);
  }
  function splitBill(value){
    console.log(value);
    setFriendList((friendList)=>friendList.map((friend)=>friend.id===selectedFriend.id ?{...friend,balance:Number(friend.balance)+value}:friend));
  }
  return <div className="app"> 
  <div className="sidebar">
  <FriendList friends={friendList} onSetShowForm={setShowBillForm} showBillForm={showBillForm} selectedFriend={selectedFriend} onSetSelectedFriend={setSelectedFriend}/>
  {addFriendIsOpen&&<FormAddFriend friendList={friendList} onSetFriendList={setFriendList} onSetAddFriendIsOpen={handleFriendForm} />}
  <Button onClick={handleFriendForm}>{addFriendIsOpen?'close':'Add Friend'}</Button>
  </div>
  {showBillForm && <FormAddBill selectedFriend={selectedFriend} splitBill={splitBill} setShowBillForm={setShowBillForm} setSelectedFriend={setSelectedFriend} />}
  </div>
}
function FriendList({friends,onSetShowForm,showBillForm,selectedFriend,onSetSelectedFriend}){
  return <ul>{friends.map((item)=> <Friend friend={item} key={item.id} onSetShowForm={onSetShowForm} selectedFriend={selectedFriend} onSetSelectedFriend={onSetSelectedFriend} showBillForm={showBillForm} />) }</ul>
}
function Friend({friend,onSetShowForm,selectedFriend,onSetSelectedFriend,showBillForm}){
  const isOpenForm=friend?.id===selectedFriend?.id;
  return <li className={friend?.id===selectedFriend?.id ?"selected":''} >
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>
    {friend.balance<0 && <p className="red">You owe {friend.name} ${Math.abs(friend.balance)}</p>}
    {friend.balance>0 && <p className="green">{friend.name} ows you ${friend.balance}</p>}
    {friend.balance===0 && <p>You and {friend.name} shared evenly</p>}
    <Button onClick={()=>{onSetShowForm((formStatus)=> !formStatus);
     onSetSelectedFriend(friend);
     showBillForm &&friend.id!==selectedFriend.id && onSetShowForm((formStatus)=>!formStatus);
      showBillForm && friend.id===selectedFriend.id && onSetSelectedFriend('');
      // handleShowForm(friend);
     
    }}>{!isOpenForm ?'Select':'Close'}</Button>
  </li>
}
function Button({children,onClick}){
  return <button  className="button" onClick={onClick}>{children}</button>
}
function FormAddFriend({friendList,onSetFriendList,onSetAddFriendIsOpen}){
  const [name,setName]=useState('');
  const [image,setImage]=useState('https://i.pravatar.cc/48');
  function handleAddFriend(e){
    e.preventDefault();
    const id=crypto.randomUUID();
    const friend={
      name,
      image:`${image}?=${id}`,
      id,
      balance:0
    }
    if(!friend.name) return;
    onSetFriendList((friends)=>[...friends,friend])
    setName('');
    onSetAddFriendIsOpen();
    setImage('https://i.pravatar.cc/48');
  }
  
  return <form className="form-add-friend" onSubmit={handleAddFriend}>
    <label>👬🏻Friend Name</label>
    <input type="text" value={name} onChange={e=>setName(e.target.value)} />
    <label>👳🏿‍♂️Image URl</label>
    <input type="text" value={image} onChange={e=>setImage(e.target.value)} />
    <Button>Add</Button>

  </form>
}
function FormAddBill({selectedFriend,splitBill,setShowBillForm,setSelectedFriend}){
  const [amount,setAmount]=useState('');
  const [expense,setExpense]=useState('');
  const share=Number(amount-expense);
  const [billPayedBy,setBillPayedBy]=useState('you');
  function hanldeOnSubmitForm(e){
    e.preventDefault();
    // setShare(amount-expense);
    if(!amount || !expense) return;
splitBill(billPayedBy==='user' ? -Number(expense) :Number(share));
setAmount('')
setExpense('')
setShowBillForm(cur=>!cur)
setSelectedFriend('')
  }
  return <form className="form-split-bill" onSubmit={hanldeOnSubmitForm}>
 <h2>Split a bill with {selectedFriend?.name}</h2>
<label>🎗Bill Value</label>
<input type="text" value={Number(amount)} onChange={(e)=>setAmount(e.target.value)} />
<label>🎺 Your expense</label>
<input type="text" value={Number(expense)} onChange={(e)=>{Number(e.target.value)>amount?setExpense(amount):setExpense(e.target.value)}} />
<label>👬🏿 {selectedFriend?.name} expense</label>
<input type="text" disabled value={share} />
<label>🧔🏾‍♂️ who is paying the bill?</label>
<select value={billPayedBy} onChange={(e)=>setBillPayedBy(e.target.value)}>
  <option value="you">You</option>
  <option value="user">{selectedFriend?.name}</option>

</select>
<Button>Split Bill</Button>




  </form>
}
