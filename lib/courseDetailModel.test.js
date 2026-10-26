import test from "node:test";
import assert from "node:assert/strict";
import master from "../data/v2/courses-master.json" with { type: "json" };
import schools from "../data/v2/schools.json" with { type: "json" };
import { buildCourseDetail, buildSchoolDetail } from "./courseDetailModel.js";
import { getCourseData, schoolNotes, schoolLabel } from "./courseDataV2.js";

test("all 85 detail models have complete source fields and preserve original salaries and use the shared distance order", () => {
  for(const {id,name,group} of master){
    const model=buildCourseDetail(id), source=getCourseData(id);
    assert.ok(model);assert.equal(model.name,name);assert.equal(model.group,group);
    for(const key of ["overview","interestsStrengths","chedBasis","guidanceTips"])assert.ok(model[key]);
    assert.ok(model.studyTopics.length && model.careers.length && model.schools.length);
    assert.deepEqual(model.careers.map(c=>c.salaryRange),source.careers.map(c=>c.salaryRange));
    const rows=model.schools.flatMap(g=>g.schools);
    assert.deepEqual(rows.map(s=>s.id),source.schools.map(s=>s.id));
    for(let i=0;i<rows.length;i++){
      assert.equal(rows[i].label,schoolLabel(source.schools[i]));assert.deepEqual(rows[i].notes,schoolNotes(source.schools[i]));
      assert.ok(!Object.hasOwn(rows[i],"sourceNames") && !Object.hasOwn(rows[i],"programNotes"));
      for(const key of ["campus","location","province"])assert.equal(Object.hasOwn(rows[i],key),source.schools[i][key]!==null);
    }
    assert.ok(model.salarySources.methodology && model.salarySources.references.length);
  }
});
test("careerNotes, one-school model and unknown/legacy IDs",()=>{
  assert.equal(buildCourseDetail("SCI02").careerNotes.length,1);assert.equal(buildCourseDetail("SOC01").careerNotes.length,1);
  assert.equal(buildCourseDetail("BUS02").schools.flatMap(g=>g.schools).length,1);
  for(const id of ["BSIT-001","missing",null])assert.equal(buildCourseDetail(id),null);
});
test("a real community-college row shows derived location and never major-only",()=>{
  const school=schools.find(s=>s.type==="community-college" && s.flags.includes("derived-location"));
  assert.ok(school);assert.ok(buildSchoolDetail(school).notes.includes("Location inferred from the town name"));
  assert.ok(!schoolNotes(school).includes("Major or specialization listed"));
  // Some community rows have no coded degree. They must not be invented into a course.
  for(const id of school.courseIds){const model=buildCourseDetail(id);assert.ok(model.schools.flatMap(g=>g.schools).find(s=>s.id===school.id).notes.includes("Location inferred from the town name"));}
});
