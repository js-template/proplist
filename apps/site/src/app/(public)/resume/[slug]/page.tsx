import React from "react"
import { find } from "@/lib/strapi"
import { StrapiSeoFormate } from "@/lib/strapiSeo"
import { Metadata, ResolvingMetadata } from "next"
import Script from "next/script"
import { CandidateProfile } from "@padma/metajob-ui/block"

// *** generate metadata type
type Props = {
   params: { slug: string }
   searchParams: { [key: string]: string | string[] | undefined }
}

// *** generate metadata for the page
export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
   const pageSlug = params?.slug
   //const language = getLanguageFromCookie();
   // fetch data
   const { data } = await find(
      "api/candidates",
      {
         filters: {
            slug: {
               $eq: pageSlug
            }
         },
         populate: "deep",
         publicationState: "live",
         locale: ["en"]
      },
      "no-cache"
   )

   // if data?.data?.attributes?.seo is not available, return default data
   if (!data?.data[0]?.attributes?.seo) {
      return {
         title: data?.data[0]?.attributes?.title || "Title not found",
         description: data?.data[0]?.attributes?.description || "Description not found"
      }
   }

   return StrapiSeoFormate(data?.data[0]?.attributes?.seo, `/candidates/${pageSlug}`)
}
export default async function page({ params }: { params: { slug: string } }) {
   const pageSlug = params?.slug

   // const language = getLanguageFromCookie();
   // *** get candidates data from strapi ***
   const { data, error } = await find(
      // "api/candidates",
      "api/resumes",
      {
         filters: {
            slug: {
               $eq: pageSlug
            }
         },
         populate: "deep",
         publicationState: "live",
         locale: ["en"]
      },
      "force-cache"
   )
   if (error) {
      return <div>Something went wrong</div>
   }
   return (
      <>
         <CandidateProfile data={data?.data} />
         {data?.data[0]?.attributes?.seo?.structuredData && (
            <Script
               id='json-ld-structured-data'
               type='application/ld+json'
               dangerouslySetInnerHTML={{
                  __html: JSON.stringify(data?.data[0]?.attributes?.seo?.structuredData)
               }}
            />
         )}
      </>
   )
}
