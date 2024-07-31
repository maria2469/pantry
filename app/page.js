'use client'
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, query, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  gap: 3,
  display: "flex",
  flexDirection: "column",
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  const updatePantry = async () => {
    const pantryCollection = collection(firestore, 'pantry');
    const pantryQuery = query(pantryCollection);
    const pantryList = [];
    const snapshot = await getDocs(pantryQuery);
    snapshot.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item, quantity) => {
    if (!item.trim()) {
      alert("Item name cannot be empty");
      return;
    }
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + quantity });
    } else {
      await setDoc(docRef, { count: quantity });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count > 1) {
        await setDoc(docRef, { count: count - 1 });
      } else {
        await deleteDoc(docRef);
      }
      await updatePantry();
    }
  };

  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={'column'}
      border={'1px solid black'}
      gap={2}
      sx={{
        background: 'linear-gradient(to right, #A3B3EB , #FF99AC)',
      }}
    >
      <Modal
        open={addOpen}
        onClose={handleAddClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName, quantity);
                setItemName('');
                setQuantity(1);
                handleAddClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={searchOpen}
        onClose={handleSearchClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Search items
          </Typography>
          <TextField
            label="Search Items"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      </Modal>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleAddOpen}>Add</Button>
        <Button variant="contained" onClick={handleSearchOpen}>Search</Button>
      </Stack>
      <Box border={'1px solid black'} width={'800px'}>
        <Box width={'100%'} height={'100px'} bgcolor='#EECDA3'>
          <Typography
            variant={'h2'}
            color={'#333'}
            textAlign="center"
          >
            Pantry items
          </Typography>
        </Box>
        <Stack
          height="300px"
          width="100%"
          spacing={2}
          overflow="auto"
        >
          {filteredPantry.map(({ name, count }) => (
            <Box
              key={name}
              minHeight="150px"
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              paddingX={2}
            >
              <Typography
                variant={'h3'}
                color={'#333'}
                textAlign="center"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color={'#333'} textAlign={'center'}> Quantity: {count}</Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
