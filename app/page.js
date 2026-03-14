

import { createClient } from "@/utils/supabase/server"

export default async function Home() {
    const supabase = await createClient();
    const {data: projects} = await supabase.from("projects").select("*");

    return (
        <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1>Justified Media Portfolio</h1>
            <p>Helping businesses in Delta State grow online.</p>
      
            <hr />

            {projects.length === 0 ? (
                <p>Loading projects...</p>
            ) : (
                projects.map((project) => (
                            <div key={project.id} style={{ border: '1px solid #ccc', padding: '20px', marginTop: '10px' }}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <small>SEO Slug: {project.slug}</small>
                    </div> // Added closing di
                )
            )
        )
    }
       </main>
     )
    
}
