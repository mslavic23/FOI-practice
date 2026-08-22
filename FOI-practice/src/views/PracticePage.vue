<template>
    <section class="practice-page">
        <div class="practice-page-exams">
            <ul class="practice-exams">
                <li>JavaScript u frontend-u
                <ul class="practice-front-categories">
                    <li><router-link to="/practice/javascript">JavaScript</router-link></li>
                    <li><router-link to="/practice/dom">DOM</router-link></li>
                    <li><router-link to="/practice/frontendframework">Frontend Framework</router-link></li>
                    <li><router-link to="/practice/webstranica">Web Stranica</router-link></li>
                </ul></li>
                <li>JavaScript u backend-u 
                <ul class="practice-back-categories">
                    <li><router-link to="/practice/jsposluzitelj">JavaScript na poslužitelju</router-link></li>
                    <li><router-link to="/practice/nodejs">Node.js</router-link></li>
                    <li><router-link to="/practice/asinkronost">Asinkronost</router-link></li>
                    <li><router-link to="/practice/eventloop">Event-loop</router-link></li>
                    <li><router-link to="/practice/webaplikacija">Web aplikacija</router-link></li>
                </ul>
                </li>
            </ul>
        </div>
     </section>
</template>