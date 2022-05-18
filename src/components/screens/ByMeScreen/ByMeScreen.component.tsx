import React, { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../../../InitApp'
import { useFocusEffect } from '@react-navigation/native'
import { getDownloadURL, ref } from 'firebase/storage'
import Spinner from '../../atoms/Spinner/Spinner.component'
import { ScrollView } from 'react-native-gesture-handler'
import { Image, View } from 'react-native'
import Heading from '../../atoms/Heading/Heading.component'
import Paragraph from '../../atoms/Paragraph/Paragraph.component';
import { format } from 'fecha'
import { splitUserFromEmail } from '../../../utils/utils'
import { useSelector } from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient'

const ByMeScreen = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>([]);
    const userData:any = useSelector<any>(store => store.auth);

    useFocusEffect(
        useCallback(() => {
            getDocuments();
    }, []))

    const getDocuments = async () => {
        setLoading(true);
        setData([]);
            try {
                const querySnapshot = await getDocs(query(collection(db, "images"), where("user", "==", userData.user.email),orderBy('creationDate')));
                querySnapshot.forEach(async (doc) => {
                    const res:any = {...doc.data(), id:doc.id};
                    const imageUrl = await getDownloadURL(ref(storage, res.image));
                    const voted = res.votes.some(vote => vote === userData.user.email);
                    setData(arr => [...arr, {...res, id:doc.id, imageUrl: imageUrl, voted}]);
                });
            } catch (error) {
                console.log(error)                    
            }finally{
                setLoading(false);
            }
    }

    return (
        <ScrollView>
            <LinearGradient style={{alignItems:'center', height:'100%', width:'100%'}} colors={["#a8c0ff", "#3f2b96"]}>
            {loading && <Spinner />}
            {data.map((item) => (
                <View style={{backgroundColor:'white',elevation:20,height:400, width:'90%', margin:10, borderBottomEndRadius:20, borderBottomStartRadius:20}}>
                    <Image resizeMode='cover' style={{flex:1}} source={{uri:item.imageUrl}} />
                    <View style={{padding:10, justifyContent:'space-between', height:100 }}>
                        <View>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Heading>{splitUserFromEmail(item.user)}</Heading>
                                <Heading>{item.votes.length} votos</Heading>
                            </View>
                            <Paragraph textAlign='left'>{format(item.creationDate.toDate(), 'DD/MM/YYYY HH:mm')}hs</Paragraph>
                        </View>
                    </View>
                </View>
            ))}
            </LinearGradient>
        </ScrollView>
    )
}

export default ByMeScreen