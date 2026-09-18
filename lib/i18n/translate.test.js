import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { catalog, translate } from './translate.js';
const items=JSON.parse(readFileSync(new URL('../../data/items.json',import.meta.url)));
const courses=JSON.parse(readFileSync(new URL('../../data/explore-courses.json',import.meta.url)));
test('all assessment prompts and options have translations or standard academic names',()=>{
 const standard=new Set(['Strand','Academic – STEM','Academic – ABM','Academic – HUMSS','TVL','Filipino / Araling Panlipunan','MAPEH – Arts']);
 for(const item of items)for(const text of [item.text,...(item.options||[]).map(o=>o.text)])assert.ok(translate(text,'fil')!==text||standard.has(text),text);
});
test('all course narratives and notes are translated; proper names remain intact',()=>{
 for(const c of courses){for(const text of [c.overview,c.guidanceTips,...c.schoolNotes,...c.schools.map(s=>s.notes),...c.careerOpportunities.map(s=>s.notes)].filter(text=>text&&!/^\((DBM )?Salary Grade \d+\)$/.test(text)))assert.notEqual(translate(text,'fil'),text,text);
 for(const name of [c.courseName,...c.schools.map(s=>s.name),...c.careerOpportunities.map(s=>s.jobTitle)])assert.equal(translate(name,'fil'),name);}
});
test('English source is unchanged except requested em dash removal',()=>{for(const text of Object.keys(catalog))assert.equal(translate(text,'en'),text.replace(/—/g,';'));});
test('dynamic labels preserve factual values and personal names',()=>{
 assert.equal(translate('Choose Your Explorer, Forest','fil'),'Piliin ang Iyong Manlalakbay, Forest');
 assert.equal(translate('Wayfinder: not yet earned','fil'),'Tagahanap ng Landas: hindi pa nakamit');
 assert.equal(translate('Step 2 of 2','fil'),'Hakbang 2 sa 2');
 assert.equal(translate('Rank #1: BS Computer Science','fil'),'Ranggo #1: BS Computer Science');
});
test('catalog has no em dashes, emoji, or missing values',()=>{for(const [key,value]of Object.entries(catalog)){assert.equal(typeof value,'string',key);assert.ok(value.length,key);assert.ok(!/[—\p{Emoji_Presentation}]/u.test(value),key);}});
