import './SideBar.scss'
import { socketProxy } from '@/util/socketSingleton'
import User from './User'
import {
    CSSProperties,
    useState,
    useEffect,
    useContext
} from 'react'
import { context } from '@/util/globalContext/ContextProvider'
import { IGameInvite } from 'shared'
import { v4 as uuidv4 } from 'uuid';
import GameInvite from './GameInvite'

interface ISideBarProps {
    activeSideBar: "gameInvites" | "usersOnline" | null
}

const SideBar: React.FC<ISideBarProps> = ({ activeSideBar }) => {
    const [usersOnline, setUsersOnline] = useState<string[]>([])
    const [gameInvites, setGameInvites] = useState<IGameInvite[]>([])
    const { username } = useContext(context)
    const styles: CSSProperties = activeSideBar ? {} : { display: 'none' }


    const handleGameInvite = (invite: IGameInvite) => {
        setGameInvites(prevState => {
            console.log('prevstate: ' + prevState)
            const index = prevState.findIndex(inv => {
                return inv.id === invite.id
            })
            if (index === -1) return [...prevState, invite]
            return [...prevState]
        })
    }



    useEffect(() => {
        socketProxy.on('online_users_update', users => {
            setUsersOnline(users)
        })

        socketProxy.on('game_invites_update', invites => {
            setGameInvites(invites)
        })

        socketProxy.on('game_invite', handleGameInvite)

        socketProxy.emit('fetch_online_users')
        socketProxy.emit('fetch_game_invites')

        return () => {
            socketProxy.removeListener('online_users_update')
            socketProxy.removeListener('game_invites_update')
            socketProxy.removeListener('game_invite')
        }

    }, [])



    return (
        <div
            className='SideBar'
            style={styles}
        >
            {activeSideBar}

            {activeSideBar === 'gameInvites' ?
                gameInvites.map(invite => {
                    return <GameInvite
                        invite={invite}
                        key={uuidv4()}
                    />
                })
                :
                usersOnline.map(user => {
                    return username === user ? null :
                        <User
                            key={uuidv4()}
                            username={user}
                        />
                })
            }
        </div>
    );
}

export default SideBar