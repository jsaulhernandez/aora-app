import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import TrendingItem from "./TrendingItem";
import { IPost } from "@/data/interfaces/post.interface";

const Trending = ({ posts }: { posts: IPost[] }) => {
  const [activeItem, setActiveItem] = useState(
    posts.length > 0 ? posts[0].$id : ""
  );

  const viewableItemsChanged = ({ viewableItems }: { viewableItems: any }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem key={item.$id} activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
    />
  );
};

export default Trending;
