import { useState } from "react";
import { Image, ImageBackground, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { ResizeMode, Video } from "expo-av";
// import { useVideoPlayer, VideoView } from "expo-video";
// interfaces
import { IPost } from "@/data/interfaces/post.interface";
// constants
import { icons } from "@/constants";

const zoomIn = {
  0: { opacity: 1, scale: 0.9 },
  1: { opacity: 1, scale: 1 },
};

const zoomOut = {
  0: { opacity: 1, scale: 1 },
  1: { opacity: 1, scale: 0.9 },
};

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: string;
  item: IPost;
}) => {
  const [play, setPlay] = useState(false);
  // const player = useVideoPlayer(
  //   "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  // );

  // useEffect(() => {
  //   if (player) {
  //     player.loop = true;
  //     if (play) {
  //       player.play();
  //     } else {
  //       player.pause();
  //     }
  //   }
  // }, [player, play]);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{
            uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
          }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          style={{
            width: 208,
            height: 288,
            borderRadius: 33,
            marginTop: 12,
            backgroundColor: "rgb(255 255 255 / 0.1)",
          }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: any) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

export default TrendingItem;
