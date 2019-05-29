/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
/**
 * @file Tests covering serialization to JSON.
 */
#include "GDCore/Serialization/Serializer.h"
#include "GDCore/CommonTools.h"
#include "GDCore/Events/Builtin/StandardEvent.h"
#include "GDCore/Events/Event.h"
#include "GDCore/Events/EventsList.h"
#include "GDCore/Events/Serialization.h"
#include "GDCore/Project/Layout.h"
#include "GDCore/Project/Project.h"
#include "GDCore/Project/Variable.h"
#include "GDCore/Tools/SystemStats.h"
#include "GDCore/Tools/VersionWrapper.h"
#include "catch.hpp"

using namespace gd;

TEST_CASE("SerializerElement", "[common]") {
  SECTION("Basics and copying") {
    SerializerElement element;
    element.AddChild("child1").SetStringValue("value123");
    element.AddChild("child2").SetDoubleValue(45.6);
    element.SetStringAttribute("attr1", "attr123");

    SerializerElement copiedElement = element;
    REQUIRE(element.GetChild("child1").GetStringValue() == "value123");
    REQUIRE(element.GetChild("child2").GetDoubleValue() == 45.6);
    REQUIRE(element.GetStringAttribute("attr1") == "attr123");
    REQUIRE(copiedElement.GetChild("child1").GetStringValue() == "value123");
    REQUIRE(copiedElement.GetChild("child2").GetDoubleValue() == 45.6);
    REQUIRE(copiedElement.GetStringAttribute("attr1") == "attr123");

    element.GetChild("child1").SetStringValue("value123 modified");
    copiedElement.GetChild("child2").SetDoubleValue(45.678);
    copiedElement.SetStringAttribute("attr1", "attr123 modified");
    REQUIRE(element.GetChild("child1").GetStringValue() == "value123 modified");
    REQUIRE(element.GetChild("child2").GetDoubleValue() == 45.6);
    REQUIRE(element.GetStringAttribute("attr1") == "attr123");
    REQUIRE(copiedElement.GetChild("child1").GetStringValue() == "value123");
    REQUIRE(copiedElement.GetChild("child2").GetDoubleValue() == 45.678);
    REQUIRE(copiedElement.GetStringAttribute("attr1") == "attr123 modified");
  }
}

TEST_CASE("Serializer", "[common]") {
  SECTION("JSON basics") {
    gd::String originalJSON = "{\"ok\": true,\"hello\": \"world\"}";
    SerializerElement element = Serializer::FromJSON(originalJSON);
    REQUIRE(element.GetChild("ok").GetBoolValue() == true);
    REQUIRE(element.GetChild("hello").GetStringValue() == "world");

    gd::String json = Serializer::ToJSON(element);
    REQUIRE(json == originalJSON);
  }

  SECTION("Quotes and special characters") {
    gd::String originalJSON =
        "{\"\\\"hello\\\"\": \" \\\"quote\\\" \",\"caret-prop\": "
        "1,\"special-\\b\\f\\n\\r\\t\\\"\": \"\\b\\f\\n\\r\\t\"}";
    SerializerElement element = Serializer::FromJSON(originalJSON);
    REQUIRE(element.GetChild("caret-prop").GetBoolValue() == true);
    REQUIRE(element.GetChild("\"hello\"").GetStringValue() ==
            " \"quote\" ");
    REQUIRE(element.GetChild("special-\b\f\n\r\t\"").GetStringValue() ==
            "\b\f\n\r\t");

    gd::String json = Serializer::ToJSON(element);
    REQUIRE(json == originalJSON);
  }

  SECTION("UTF8 characters") {
    gd::String originalJSON =
        u8"{\"Ich heiße GDevelop\": \"Gut!\",\"Bonjour à tout le monde\": "
        u8"1,\"Hello 官话 world\": \"官话\"}";
    SerializerElement element = Serializer::FromJSON(originalJSON);
    REQUIRE(
        element.GetChild(u8"Bonjour à tout le monde").GetBoolValue() ==
        true);
    REQUIRE(element.GetChild(u8"Ich heiße GDevelop").GetStringValue() ==
            "Gut!");
    REQUIRE(element.GetChild(u8"Hello 官话 world").GetStringValue() ==
            u8"官话");

    gd::String json = Serializer::ToJSON(element);
    REQUIRE(json == originalJSON);
  }

  SECTION("Idempotency of unserializing and serializing again") {
    auto unserializeAndSerializeToJSON = [](const gd::String& originalJSON) {
      SerializerElement element = Serializer::FromJSON(originalJSON);
      return Serializer::ToJSON(element);
    };

    SECTION("Strings and numbers") {
      gd::String test1 = "\"\"";
      REQUIRE(unserializeAndSerializeToJSON(test1) == test1);
      gd::String test2 = "123.455";
      REQUIRE(unserializeAndSerializeToJSON(test2) == test2);
    }
    SECTION("Objects") {
      gd::String test1 = "{}";
      REQUIRE(unserializeAndSerializeToJSON(test1) == test1);
      gd::String test2 = "{\"a\": 1}";
      REQUIRE(unserializeAndSerializeToJSON(test2) == test2);
      gd::String test3 = "{\"a\": 1,\"b\": {\"c\": 2}}";
      REQUIRE(unserializeAndSerializeToJSON(test3) == test3);
    }
    SECTION("Arrays") {
      gd::String test1 = "[]";
      REQUIRE(unserializeAndSerializeToJSON(test1) == test1);
      gd::String test2 = "[1,2]";
      REQUIRE(unserializeAndSerializeToJSON(test2) == test2);
    }
    SECTION("Mixed") {
      gd::String test1 =
          "{\"hello\": {\"world\": [{},[],3,\"4\"],\"world2\": [-1,\"-2\","
          "{\"-3\": [-4]}]}}";
      REQUIRE(unserializeAndSerializeToJSON(test1) == test1);
      gd::String test2 =
          "{\"hello\": {\"world\": [{},[],3,4],\"world2\": [-1,\"-2\","
          "{\"-3\": [-4]}]}}";
      REQUIRE(unserializeAndSerializeToJSON(test2) == test2);
    }
  }
}
