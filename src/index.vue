<template>
  <div class="mx-auto mt-6 w-full max-w-7xl p-6">
    <div class="mb-4 text-4xl">최근 클립</div>
    <RecentClipList />
  </div>
</template>
<script setup lang="ts">
import RecentClipList from "./components/RecentClipList.vue";
// import algoliasearch from 'algoliasearch/lite';
// import { autocomplete, getAlgoliaResults, Pragma, Render, VNode } from '@algolia/autocomplete-js';
// import '@algolia/autocomplete-theme-classic';
// const VITE_ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
// const VITE_ALGOLIA_API_KEY = import.meta.env.VITE_ALGOLIA_API_KEY;

// const searchClient = algoliasearch(VITE_ALGOLIA_APP_ID, VITE_ALGOLIA_API_KEY)

// onMounted(async () => {
//   autocomplete<{ contentName: string; creatorName: string; objectID: string; }>({
//   //   container: '#autocomplete',
//   //   openOnFocus: true,
//   //   getSources({ query }) {
//   //     return [
//   //       {
//   //         sourceId: 'products',
//   //         getItems() {
//   //           return getAlgoliaResults({
//   //             searchClient,
//   //             queries: [
//   //               {
//   //                 indexName: 'contents',
//   //                 query,
//   //                 params: {
//   //                   hitsPerPage: 10,
//   //                   attributesToSnippet: ['contentName:10'],
//   //                   snippetEllipsisText: '…',
//   //                 },
//   //               },
//   //             ],
//   //           });
//   //         },
//   //         templates: {
//   //           item({ item, components }) {
//   //             return (
//   //               <div className="aa-ItemWrapper">
//   //                 <div className="aa-ItemContent">
//   //                   <div className="aa-ItemIcon">
//   //                     <img
//   //                       src={`https://cdn.naseong.kim/${item.objectID}`}
//   //                       alt={item.contentName}
//   //                       width="40"
//   //                       height="40"
//   //                     />
//   //                   </div>
//   //                   <div className="aa-ItemContentBody">
//   //                     <div className="aa-ItemContentTitle">
//   //                       <components.Snippet hit={item} attribute="contentName" />
//   //                     </div>
//   //                   </div>
//   //                 </div>
//   //               </div>
//   //             ) as unknown as VNode;
//   //           },
//   //         },
//   //       },
//   //     ];
//   //   },
//   //   renderer: { createElement: h as Pragma, Fragment, render: render as Render },
//   // });
// })
</script>
