import assert from "node:assert/strict";
import test from "node:test";
import { toggleCourseComparison } from "./courseComparison.js";

test("a third course never replaces either selected course", () => {
  const selected = ["BSIT-001", "BSCS-001"];
  assert.deepEqual(toggleCourseComparison(selected, "BSIS-001"), selected);
  assert.deepEqual(selected, ["BSIT-001", "BSCS-001"]);
});

test("either selection can be removed and its slot reused", () => {
  for (const remove of ["BSIT-001", "BSCS-001"]) {
    const remaining = toggleCourseComparison(["BSIT-001", "BSCS-001"], remove);
    assert.equal(remaining.length, 1);
    assert.deepEqual(toggleCourseComparison(remaining, "BSIS-001"), [...remaining, "BSIS-001"]);
  }
});
