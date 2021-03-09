import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';

import { Plugins } from "@capacitor/core";
import { play, pause, playForward, search } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import {Howl, Howler} from 'howler';

const { NativeAudio } = Plugins;

interface Song {
  title: string;
  cover: string;
  source: string;
}

const resources: Song[] =[
  {
    title: 'Han Cogido la cosa - Grupo Niche',
    cover: 'https://nifty-gates-e31b65.netlify.app/images/niche.jpg',
    source: 'https://nifty-gates-e31b65.netlify.app/mp3/Han%20Cogido%20La%20Cosa%20%20Grupo%20Niche.mp3'
  },
  {
    title: 'Esa mujer - Marino civico costa',
    cover: 'https://nifty-gates-e31b65.netlify.app/images/mariano.jpg',
    source: 'https://nifty-gates-e31b65.netlify.app/mp3/esa%20mujer%20mariano%20civico%20costa%20brava.mp3'
  },
  {
    title: 'Ladron de tu amor - Ray de paz',
    cover: 'https://nifty-gates-e31b65.netlify.app/images/ray.jpg',
    source: 'https://nifty-gates-e31b65.netlify.app/mp3/Ladron%20De%20Tu%20Amor%20-%20Louie%20Ramirez%20&%20Ray%20de%20La%20Paz.mp3'
  },
  {
    title: 'Te va a doler - Maelo Ruiz',
    cover: 'https://nifty-gates-e31b65.netlify.app/images/maelo.jpg',
    source: 'https://nifty-gates-e31b65.netlify.app/mp3/Te%20Va%20Doler%20-%20Maelo%20Ruiz.mp3'
  },
  {
    title: 'Soy el hombre misterioso',
    cover: 'https://nifty-gates-e31b65.netlify.app/images/misterioso.jpg',
    source: 'https://nifty-gates-e31b65.netlify.app/mp3/Salsa%20soy%20el%20hombre%20misterioso.mp3'
  }
];

const Home: React.FC = () => {
  const source = 'https://nifty-gates-e31b65.netlify.app/mp3/esa%20mujer%20mariano%20civico%20costa%20brava.mp3';

  const [current, setCurrent] = useState<Song>(resources[0]);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayer, setPlayer] = useState<Howl | undefined>(undefined);

  const loadAndPlay = (source: string) => {
    NativeAudio.preloadComplex({
      assetPath: source,
      assetId: source,
      volume: 1.0,
      audioChannelNum: 1,
    })
    .then(() => {
      NativeAudio.play({
        assetId: source,
      });
    })
    .catch((error: any) => {
      setLoadingStatus('Error loading song! ' + error);
    });
  }

  const playerPlay = (source: Song) => {
    currentPlayer?.pause();
    currentPlayer?.stop();

    const player = new Howl({
      src: source.source,
      preload: true,
      html5: true,
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onloaderror: (value, error) => {
        setLoadingStatus(`Howl loading (${value}) error ${error} `);
      },
      onload: () => {
        setLoadingStatus(`Sound loaded!`);
      }
    });

    player.play();

    setPlayer(player);
  }

  const playerPause = () => {
    setLoadingStatus(`Pausing ${currentPlayer}`);
    currentPlayer?.pause();
  }

  const playerNext = () => {
    playerPause();

    const index = resources.indexOf(current);
    const isLast = resources[resources.length - 1] === current;
    let newValue: Song;

    if (index !== -1 && isLast === false) {
      newValue = resources[index + 1];
      setCurrent(newValue);
    } else {
      newValue = resources[0];
      setCurrent(newValue);
    }

    playerPlay(newValue);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonImg
          src={current.cover}
        />
        <h3>{current.title}</h3>

        {(isPlaying === false) && 
          <IonButton onClick={() => playerPlay(current)}>
            <IonIcon slot="icon-only" icon={play} />
          </IonButton>
        }

        {(isPlaying) && 
          <IonButton onClick={playerPause}>
            <IonIcon slot="icon-only" icon={pause} />
          </IonButton>
        }
        <IonButton onClick={playerNext}>
          <IonIcon slot="icon-only" icon={playForward} />
        </IonButton>

        <div style={{marginLeft: 5, marginTop: 3}}>
          {resources.map((item) => {
            const isSelected = current === item;

            return (
              <div style={{backgroundColor: '#F0F0F0', padding: 3}} onClick={() => {
                setCurrent(item);
                playerPlay(item);
              }}>
                <p style={{fontWeight: isSelected ? 'bold' : 'normal'}}>{item.title}</p>
              </div>
            );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
