const Express = require('express')
const cors = require('cors')
require('dotenv').config()
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { apps } = require('firebase-admin');
const axios  = require('axios');

const app = Express()
app.use(Express.json())
app.use(cors({
    origin: 'https://unsplashcollectionfern.vercel.app'
}))

const PORT = process.env.PORT
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT)
if(!apps?.length) {
  initializeApp({
    credential: cert(serviceAccount)
  })
}
const db = getFirestore()
const collection = db.collection('collections')
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

app.get('/api/images', async (req,res) => {
    const {page=1, search} = req.query
    if(!search) return res.status(400).send('Bad request, no search provided')
    try {
        const {data} = await axios.get('https://api.unsplash.com/search/photos/', {
            params: new URLSearchParams({
                query: search,
                page,
                per_page: 25
            }),
            headers: {
                'Authorization': 'Client-ID '+process.env.ACCESS_KEY
            }
        })
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
    // images search
})
app.get('/api/image', async (req,res) => {
    const {id} = req.query
    if(!id) return res.status(400).send('Bad reuest, no id provided')
    try {
        const {data} = await axios.get('https://api.unsplash.com/photos/'+id, {
            headers: {
                'Authorization': 'Client-ID '+process.env.ACCESS_KEY
            }
        })
        const collections = (await collection.where('photos', 'array-contains', id).get()).docs.map(doc => {
            let data = doc.data()
            return {
                id: doc.id,
                title: data.name,
                covers: data.covers?.[0],
                total: data.photos?.length??0
            }
        })
        
        res.status(200).send({
            id: data.id,
            alt_description: data.alt_description,
            created_at: data.created_at,
            height: data.height,
            width: data.width,
            links: {download_location: data.links?.download_location},
            urls: {
                full: data.urls?.full,
                raw: data.urls?.raw,
                small: data.urls?.small
            },
            user: {
                id: data.user?.id,
                links: {html: data.user?.links?.html},
                name: data.user?.name,
                profile_image: {
                    large:data.user?.profile_image?.large,
                    medium:data.user?.profile_image?.medium,
                    small: data.user?.profile_image?.small
                },
                username: data.user?.username
            },
            collections
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
    // image details
})
app.get('/api/addcollections', async (req,res) => {
    const {photo_id, search=''} = req.query
    if(!photo_id) return res.status(400).send('Bad request, no photo id provided')
    try {
        const data = (await collection
            .orderBy('searchName')
            .startAt(search.toLowerCase())
            .endAt(search.toLowerCase()+'\uf8ff')
            .get()).docs.reduce((docs,doc) => {
            let data = doc.data()
            if(!data.photos?.includes(photo_id)) docs.push({
                id: doc.id,
                title: data.name,
                covers: data.covers?.[0],
                total: data.photos?.length??0
            })
            return docs
        }, [])
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
    // collections in addcollectionsmodal
})
app.get('/api/collections', async (req,res) => {
    try {
        const data = (await collection.get()).docs.map(doc => {
            let data = doc.data()
            return {
                id: doc.id,
                title: data.name,
                covers: data.covers??[],
                total: data.photos?.length??0
            }
        })
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send(error)
    }
    // collections
})
app.get('/api/download', async (req,res) => {
    const {ixid, id} = req.query
    if(!ixid) return res.status(400).send('Bad request, no ixid provided')
    if(!id) return res.status(400).send('Bad request, no image id provided')
    try {
        await axios.get(`https://api.unsplash.com/photos/${id}/download?ixid=${ixid}`, {
            headers: {
                'Authorization': 'Client-ID '+process.env.ACCESS_KEY
            }
        })
        res.status(200).send("Success")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
    // download image (post some bs to unsplash api)
})
app.get('/api/collection', async (req,res) => {
    const {collection_id} = req.query
    if(!collection_id) return res.status(400).send('Bad request, no collection id provided')
    try {
        const col = await (collection.doc(collection_id).get()).then(doc => {
            let data = doc.data()
            return {
                id: doc.id,
                title: data.name,
                total: data.photos?.length??0
            }
        })
        const photos = (await collection.doc(collection_id).collection('photos').get()).docs.map(doc => {
            let data = doc.data()
            return {
                ...data,
                id: doc.id,
            }
        })
        res.status(200).send({
            ...col,
            photos
        })
    } catch (error) {
        res.status(500).send(error)
    }
    // images inside collection
})

app.post('/api/collections', async (req,res) => {
    const {name} = req.query
    if(!name) return res.status(400).send('Bad request, no name provided')
    try {
        const resp = await collection.add({
            name,
            searchName: name.toLowerCase(),
            photos: [],
            covers: []
        })
        res.status(200).send({
            id: resp.id,
            title:name,
            photos: [],
            covers: []
        })
    } catch (error) {
        res.status(500).send(error)
    }
    // add new collection
})
app.patch('/api/collections', async (req,res) => {
    const {collection_id} = req.query
    const {id, ...photo} = req.body
    if(!collection_id) return res.status(400).send('Bad request, no collection id provided')
    if(!id||!photo) return res.status(400).send('Bad request, no photo provided or bad photo id')
    try {
        await collection.doc(collection_id).collection('photos').doc(id).set(photo)
        const covers = (await collection.doc(collection_id).collection('photos').limit(3).get()).docs.map(doc => {
            return doc.data().urls?.small || doc.data().urls?.full || doc.data().urls?.raw
        })
        await collection.doc(collection_id).update({
            photos: FieldValue.arrayUnion(id),
            covers
        })
        res.status(200).send('Success')
    } catch (error) {
        res.status(500).send(error)
    }
    // add new image to collection
})
app.delete('/api/collections', async (req,res) => {
    const {photo_id, collection_id} = req.query
    if(!collection_id) return res.status(400).send('Bad request, no collection id provided')
    if(!photo_id) return res.status(400).send('Bad request, no photo id provided')
    
    try {
        await collection.doc(collection_id).collection('photos').doc(photo_id).delete()
        const covers = (await collection.doc(collection_id).collection('photos').limit(3).get()).docs.map(doc => {
            return doc.data().urls?.small || doc.data().urls?.full || doc.data().urls?.raw
        })
        await collection.doc(collection_id).update({
            photos: FieldValue.arrayRemove(photo_id),
            covers
        })
        res.status(200).send('Success')
    } catch (error) {
        res.status(500).send(error)
    }
    // delete image from collection
})
