import React, { useState } from "react";
import { useQuery } from "react-query";
import StoryCard from "../components/StoryCard";
import StorySkeleton from "../components/StorySkeleton";
import SearchBox from "../components/SearchBox";

const fetchTopStories = async () => {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await response.json();
  const top100Ids = storyIds.slice(0, 100);
  const storyPromises = top100Ids.map(async (id) => {
    const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return storyResponse.json();
  });
  return Promise.all(storyPromises);
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useQuery("topStories", fetchTopStories);

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center mb-4">Hacker News Top 100 Stories</h1>
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {isLoading ? (
        Array.from({ length: 10 }).map((_, index) => <StorySkeleton key={index} />)
      ) : (
        filteredStories?.map((story) => <StoryCard key={story.id} story={story} />)
      )}
    </div>
  );
};

export default Index;