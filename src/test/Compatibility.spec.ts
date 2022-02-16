import axios from "axios";
import {v4 as uuidv4} from "uuid";

const BASE_SCHEMA = {
  required: ["A"],
  properties: {
    A: {
      type: "string",
    },
    B: {
      type: "string",
    },
  },
  additionalProperties: false,
};

const SCHEMA_REGISTRY_BASE_URL = "http://localhost:8081";

beforeAll(async () => {
  // Ensure Schema Registry is live
  await axios.get(`${SCHEMA_REGISTRY_BASE_URL}/schemas/types`);
});

describe("FORWARD Compatible topic - additionalProperties = false:", () => {
  it("adding an optional field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "FORWARD");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });

  it("adding a mandatory field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "FORWARD");

    registeredSchema.required.push("C");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });

  it("removing a mandatory field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "FORWARD");

    delete registeredSchema.required;
    delete registeredSchema.properties.A;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });

  it("removing an optional field should be possible", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "FORWARD");

    delete registeredSchema.properties.B;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      console.log(e);
      fail("Update failed.");
    }
  });
});

describe("FORWARD Compatible topic - additionalProperties = true:", () => {
  it("adding an optional field should succeed", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "FORWARD");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      console.log(e);
      fail("Failed unexpectedly.");
    }
  });

  it("adding a mandatory field should succeed", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "FORWARD");

    registeredSchema.required.push("C");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      console.log(e);
      fail("Failed unexpectedly.");
    }
  });

  it("removing a mandatory field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "FORWARD");

    delete registeredSchema.required;
    delete registeredSchema.properties.A;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });

  it("removing an optional field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "FORWARD");

    delete registeredSchema.properties.B;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });
});

describe("BACKWARD Compatible topic - additionalProperties = false:", () => {
  it("adding an optional field should succeed", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "BACKWARD");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      console.log(e);
      fail("Update failed.");
    }
  });

  it("adding a mandatory field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "BACKWARD");

    registeredSchema.required.push("C");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });

  it("removing a mandatory field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "BACKWARD");

    delete registeredSchema.required;
    delete registeredSchema.properties.A;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });

  it("removing an optional field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "BACKWARD");

    delete registeredSchema.properties.B;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });
});

describe("BACKWARD Compatible topic - additionalProperties = true:", () => {
  it("adding an optional field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "BACKWARD");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });

  it("adding a mandatory field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "BACKWARD");

    registeredSchema.required.push("C");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });

  it("removing a mandatory field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "BACKWARD");

    delete registeredSchema.required;
    delete registeredSchema.properties.A;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });

  it("removing an optional field should fail", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "BACKWARD");

    delete registeredSchema.properties.B;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected.");
      return true;
    }
  });
});

const setBaseSchema = async (
  setAdditionalProperties: boolean,
  compatibility: "FORWARD" | "BACKWARD"
): Promise<{schemaId: string, registeredSchema: any}> => {
  const schemaId = uuidv4();

  const schemaToRegister = {
    ...BASE_SCHEMA,
  };

  schemaToRegister.additionalProperties = setAdditionalProperties;

  try {
    await setOrUpdateSchema(schemaId, schemaToRegister);
  } catch (e) {
    console.log(e);
  }

  await axios.put(`${SCHEMA_REGISTRY_BASE_URL}/config/${schemaId}`, { compatibility: compatibility });

  return { schemaId: schemaId, registeredSchema: schemaToRegister };
};

const setOrUpdateSchema = async (id: string, schema: any) => {
  await axios.post(
    `${SCHEMA_REGISTRY_BASE_URL}/subjects/${id}/versions`,
    {
      schema: JSON.stringify(schema),
      schemaType: "JSON",
    },
    { headers: { "Content-Type": "application/vnd.schemaregistry.v1+json" } }
  );
};
